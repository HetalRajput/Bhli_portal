import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getErrorMessage } from "@/lib/api/client";
import {
  flightService,
  type FlightBookingPayload,
  type FlightPassengerPayload,
  type FlightSearchPayload,
} from "@/lib/api/flights";

export type JsonRecord = Record<string, unknown>;
export type FlightRequestStatus = "idle" | "pending" | "succeeded" | "failed";

export type FlightSearchContext = {
  searchSession: number;
  refId: string;
  /** Exact criteria accepted for this provider search session. */
  request: FlightSearchPayload;
  /** Only populated when the provider returned exactly one result. */
  fallbackFlightId: string;
  flights: JsonRecord[];
};

export type FlightFareDetails = {
  searchFlightId: string;
  defaultBookingFlightId: string;
  flight: JsonRecord;
  response: JsonRecord;
  options: FlightFareOption[];
};

export type FlightFareOption = {
  index: number;
  bookingFlightId: string;
  row: JsonRecord;
  flights: JsonRecord;
  onwardFare: JsonRecord;
  totalFare: JsonRecord;
  validation: JsonRecord;
};

export type SelectedFlightFare = {
  searchFlightId: string;
  bookingFlightId: string;
  flight: JsonRecord;
  fareRow: JsonRecord;
  /** Kept for existing consumers; this is the complete fare-details data object. */
  fareDetails: JsonRecord;
  priceDetails: JsonRecord;
  fareRules: JsonRecord | null;
  fareRulesWarning: string;
};

export type SelectFlightFarePayload = {
  refId: string;
  fareDetails: FlightFareDetails;
  fareOption: FlightFareOption;
};

export type LoadFlightSeatsPayload = {
  refId: string;
  flightId: string;
  passengers: FlightPassengerPayload[];
};

export type FlightBookingState = {
  searchContext: FlightSearchContext | null;
  fareDetails: FlightFareDetails | null;
  fareOptions: FlightFareOption[];
  selectedFare: SelectedFlightFare | null;
  seatDetails: JsonRecord | null;
  bookingResult: JsonRecord | null;
  searchStatus: FlightRequestStatus;
  fareStatus: FlightRequestStatus;
  fareDetailsStatus: FlightRequestStatus;
  verificationStatus: FlightRequestStatus;
  seatStatus: FlightRequestStatus;
  bookingStatus: FlightRequestStatus;
  loadingFareId: string;
  error: string;
  fareRulesWarning: string;
  seatError: string;
  activeSearchRequestId: string | null;
  activeFareRequestId: string | null;
  activeVerificationRequestId: string | null;
  activeSeatRequestId: string | null;
  activeBookingRequestId: string | null;
};

const asRecord = (value: unknown): JsonRecord | null =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as JsonRecord) : null;

const stringValue = (record: JsonRecord | null, keys: string[], fallback = "") => {
  if (!record) return fallback;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return fallback;
};

const firstArray = (record: JsonRecord | null, keys: string[]) => {
  if (!record) return [] as unknown[];
  for (const key of keys) if (Array.isArray(record[key])) return record[key] as unknown[];
  return [] as unknown[];
};

const recordArray = (value: unknown[]) =>
  value.map(asRecord).filter((item): item is JsonRecord => Boolean(item));

const extractFlights = (providerResponse: unknown): JsonRecord[] => {
  if (Array.isArray(providerResponse)) return recordArray(providerResponse);
  const provider = asRecord(providerResponse);
  const direct = firstArray(provider, ["results", "flights", "flightResults", "flightList"]);
  if (direct.length) return recordArray(direct);
  const nested = asRecord(provider?.data);
  return recordArray(firstArray(nested, ["results", "flights", "flightResults", "flightList"]));
};

const extractFareRows = (fareData: JsonRecord) => {
  const direct = recordArray(firstArray(fareData, ["results"]));
  if (direct.length) return direct;
  return recordArray(firstArray(asRecord(fareData.data), ["results"]));
};

const firstOnwardSegment = (row: JsonRecord | null) => {
  const flights = asRecord(row?.Flights) || asRecord(row?.flights);
  const onward = asRecord(flights?.Onward) || asRecord(flights?.onward);
  return asRecord(onward?.["0"]) || recordArray(firstArray(onward, ["segments"]))[0] || null;
};

const rowFlightId = (row: JsonRecord | null) => {
  const segment = firstOnwardSegment(row);
  return stringValue(
    segment,
    ["flightID", "flightId", "flight_id"],
    stringValue(row, ["flightID", "flightId", "flight_id"], ""),
  );
};

const normalizeFareOption = (row: JsonRecord, index: number): FlightFareOption => {
  const flights = asRecord(row.Flights) || asRecord(row.flights) || {};
  const fare = asRecord(row.Fare) || asRecord(row.fare) || {};
  const onwardFare = asRecord(fare.Onward) || asRecord(fare.onward) || {};
  const totalFare = asRecord(fare.total) || asRecord(fare.Total) || {};
  const validation = asRecord(row.Validation) || asRecord(row.validation) || {};
  return {
    index,
    bookingFlightId: rowFlightId(row),
    row,
    flights,
    onwardFare,
    totalFare,
    validation,
  };
};

const providerSucceeded = (data: JsonRecord | null) => {
  if (!data || !("success" in data)) return true;
  const value = data.success;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") return /^(1|true|success)$/i.test(value.trim());
  return false;
};

const providerError = (data: JsonRecord | null, fallback: string) =>
  stringValue(data, ["errorDesc", "error", "message", "detail"], fallback);

const providerFailure = (data: JsonRecord | null) => {
  if (!data) return "";
  if (!providerSucceeded(data)) return providerError(data, "The provider reported an unsuccessful response.");
  const directError = stringValue(data, ["errorDesc", "error", "detail"], "");
  if (directError) return directError;
  const status = asRecord(data.Status) || asRecord(data.status);
  if (status && !providerSucceeded(status)) {
    return providerError(status, "The provider reported an unsuccessful status.");
  }
  return stringValue(status, ["errorDesc", "error", "detail"], "");
};

const validateBookingResult = (data: JsonRecord | null, fallbackMessage: string) => {
  if (!data || Object.keys(data).length === 0) {
    throw new Error("The server returned no booking confirmation data.");
  }
  const providerFailureMessage = providerFailure(data);
  if (providerFailureMessage) throw new Error(providerFailureMessage);
  const statuses = ["status", "booking_status", "provider_status"]
    .map((key) => stringValue(data, [key], "").toLowerCase())
    .filter(Boolean);
  const failedStatus = statuses.find((status) => /^(failed|cancelled|canceled|rejected|error)$/.test(status));
  if (failedStatus) throw new Error(fallbackMessage || `The provider returned booking status '${failedStatus}'.`);
  const hasBookingIdentity = Boolean(
    stringValue(data, ["id", "booking", "ref_id", "pnr", "ticket_number"], "") || statuses.length,
  );
  if (!hasBookingIdentity) throw new Error("The server response does not contain a booking reference or status.");
  return data;
};

const stageError = (stage: string, error: unknown, recovery: string) => {
  const message = getErrorMessage(error).trim();
  return `${stage}: ${message || "The provider did not complete the request."} ${recovery}`.trim();
};

export const searchFlights = createAsyncThunk<FlightSearchContext, FlightSearchPayload, { rejectValue: string }>(
  "flightBooking/search",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await flightService.search(payload);
      if (!response.success) throw new Error(response.message || "The flight provider rejected this search.");
      const data = asRecord(response.data);
      const refId = stringValue(data, ["ref_id", "refID"], response.ref_id || "");
      const searchSession = Number(data?.search_session || 0);
      const providerResponse = asRecord(data?.provider_response);
      const providerFailureMessage = providerFailure(providerResponse);
      if (providerFailureMessage) throw new Error(providerFailureMessage);
      const flights = extractFlights(data?.provider_response);
      const topLevelFlightId = stringValue(
        data,
        ["search_flight_id", "flight_id", "flightID"],
        response.search_flight_id || "",
      );
      if (!refId || !Number.isFinite(searchSession) || searchSession <= 0) {
        throw new Error("The provider response is missing its search reference or session.");
      }
      return {
        searchSession,
        refId,
        request: payload,
        fallbackFlightId: flights.length === 1 ? topLevelFlightId : "",
        flights,
      };
    } catch (error) {
      return rejectWithValue(stageError("Flight search failed", error, "Check the route and dates, then search again."));
    }
  },
);

export const loadFlightFares = createAsyncThunk<
  FlightFareDetails,
  { refId: string; searchFlightId: string; flight: JsonRecord },
  { rejectValue: string }
>("flightBooking/loadFares", async ({ refId, searchFlightId, flight }, { rejectWithValue }) => {
  try {
    if (!refId || !searchFlightId) throw new Error("A search reference and selected flight ID are required.");
    const response = await flightService.fareDetails(refId, searchFlightId);
    if (!response.success) throw new Error(response.message || "The provider rejected the fare-details request.");
    const data = asRecord(response.data) || {};
    const providerFailureMessage = providerFailure(data);
    if (providerFailureMessage) throw new Error(providerFailureMessage);
    const options = extractFareRows(data).map(normalizeFareOption);
    if (!options.length) throw new Error("The provider returned no bookable fare rows for this flight.");
    const defaultBookingFlightId =
      response.booking_flight_id ||
      stringValue(data, ["booking_flight_id", "flight_id", "flightID"], "");
    return { searchFlightId, defaultBookingFlightId, flight, response: data, options };
  } catch (error) {
    return rejectWithValue(stageError("Fare details failed", error, "Choose another result or run the search again."));
  }
});

export const selectFlightFare = createAsyncThunk<
  SelectedFlightFare,
  SelectFlightFarePayload,
  { rejectValue: string }
>("flightBooking/selectFare", async ({ refId, fareDetails, fareOption }, { rejectWithValue }) => {
  const bookingFlightId =
    fareOption.bookingFlightId ||
    (fareDetails.options.length === 1 ? fareDetails.defaultBookingFlightId : "");
  if (!bookingFlightId) {
    return rejectWithValue(
      "Fare verification failed: the selected fare row has no booking flight ID. Choose another fare or search again.",
    );
  }

  try {
    const priceResponse = await flightService.priceVerify(refId, bookingFlightId);
    if (!priceResponse.success) {
      throw new Error(priceResponse.message || "The price-verification request was rejected.");
    }
    const priceDetails = asRecord(priceResponse.data) || {};
    const priceFailureMessage = providerFailure(priceDetails);
    if (priceFailureMessage) throw new Error(priceFailureMessage);

    let fareRules: JsonRecord | null = null;
    let fareRulesWarning = "";
    try {
      const rulesResponse = await flightService.fareRules(refId, bookingFlightId);
      const rulesData = asRecord(rulesResponse.data);
      const rulesFailureMessage = providerFailure(rulesData);
      if (!rulesResponse.success || rulesFailureMessage) {
        fareRulesWarning =
          rulesFailureMessage ||
          providerError(rulesData, rulesResponse.message || "Fare rules are temporarily unavailable.");
      } else {
        fareRules = rulesData || {};
      }
    } catch (error) {
      fareRulesWarning = getErrorMessage(error) || "Fare rules are temporarily unavailable.";
    }

    return {
      searchFlightId: fareDetails.searchFlightId,
      bookingFlightId,
      flight: fareDetails.flight,
      fareRow: fareOption.row,
      fareDetails: fareDetails.response,
      priceDetails,
      fareRules,
      fareRulesWarning,
    };
  } catch (error) {
    return rejectWithValue(
      stageError("Fare verification failed", error, "Refresh the fare or choose another flight before booking."),
    );
  }
});

export const loadFlightSeats = createAsyncThunk<
  JsonRecord,
  LoadFlightSeatsPayload,
  { rejectValue: string }
>("flightBooking/loadSeats", async ({ refId, flightId, passengers }, { rejectWithValue }) => {
  try {
    if (!passengers.length) throw new Error("Add at least one passenger before requesting seats.");
    const response = await flightService.seats(refId, flightId, passengers);
    if (!response.success) throw new Error(response.message || "The seat-details request was rejected.");
    const data = asRecord(response.data) || {};
    const seatFailureMessage = providerFailure(data);
    if (seatFailureMessage) throw new Error(seatFailureMessage);
    return data;
  } catch (error) {
    return rejectWithValue(
      stageError("Seat details failed", error, "Review the passenger details and try again."),
    );
  }
});

export const submitFlightBooking = createAsyncThunk<
  JsonRecord,
  FlightBookingPayload,
  { rejectValue: string; state: { flightBooking: FlightBookingState } }
>(
  "flightBooking/book",
  async (payload, { rejectWithValue }) => {
    let bookingRequestSent = false;
    try {
      if (!Number.isInteger(payload.service) || payload.service <= 0) {
        throw new Error("The Flight Booking service is unavailable. Refresh the page and try again.");
      }
      if (!payload.ref_id) throw new Error("The flight reference is missing. Run the search again.");
      if (!payload.flight_id) throw new Error("The selected booking flight ID is missing.");
      if (!payload.passengers.length) throw new Error("At least one passenger is required.");
      if (!Number.isFinite(payload.search_session) || payload.search_session <= 0) {
        throw new Error("The search session is missing or invalid. Run the flight search again.");
      }
      bookingRequestSent = true;
      const response = await flightService.book(payload);
      if (!response.success) throw new Error(response.message || "The provider did not complete the booking.");
      return validateBookingResult(asRecord(response.data), response.message || "Flight booking failed.");
    } catch (error) {
      if (bookingRequestSent) {
        try {
          const statusResponse = await flightService.status({ ref_id: payload.ref_id });
          if (statusResponse.success) {
            return validateBookingResult(
              asRecord(statusResponse.data),
              statusResponse.message || "The provider has not confirmed this booking.",
            );
          }
        } catch {
          // Preserve the original booking error when status recovery is unavailable.
        }
      }
      return rejectWithValue(
        stageError(
          "Final booking failed",
          error,
          "Your booking was not confirmed. If the request timed out or the connection dropped, check My Bookings before trying again.",
        ),
      );
    }
  },
  {
    condition: (_payload, { getState }) => getState().flightBooking.bookingStatus !== "pending",
  },
);

const initialState: FlightBookingState = {
  searchContext: null,
  fareDetails: null,
  fareOptions: [],
  selectedFare: null,
  seatDetails: null,
  bookingResult: null,
  searchStatus: "idle",
  fareStatus: "idle",
  fareDetailsStatus: "idle",
  verificationStatus: "idle",
  seatStatus: "idle",
  bookingStatus: "idle",
  loadingFareId: "",
  error: "",
  fareRulesWarning: "",
  seatError: "",
  activeSearchRequestId: null,
  activeFareRequestId: null,
  activeVerificationRequestId: null,
  activeSeatRequestId: null,
  activeBookingRequestId: null,
};

const clearFareState = (state: FlightBookingState) => {
  state.fareDetails = null;
  state.fareOptions = [];
  state.selectedFare = null;
  state.seatDetails = null;
  state.fareStatus = "idle";
  state.fareDetailsStatus = "idle";
  state.verificationStatus = "idle";
  state.seatStatus = "idle";
  state.fareRulesWarning = "";
  state.seatError = "";
  state.activeFareRequestId = null;
  state.activeVerificationRequestId = null;
  state.activeSeatRequestId = null;
  state.loadingFareId = "";
};

const flightBookingSlice = createSlice({
  name: "flightBooking",
  initialState,
  reducers: {
    clearFlightError(state) {
      state.error = "";
      state.seatError = "";
    },
    clearFareRulesWarning(state) {
      state.fareRulesWarning = "";
      if (state.selectedFare) state.selectedFare.fareRulesWarning = "";
    },
    clearSeatDetails(state) {
      state.seatDetails = null;
      state.seatStatus = "idle";
      state.seatError = "";
      state.activeSeatRequestId = null;
    },
    clearFareDetails(state) {
      clearFareState(state);
      state.error = "";
    },
    clearSearch(state) {
      state.searchContext = null;
      state.bookingResult = null;
      state.searchStatus = "idle";
      state.bookingStatus = "idle";
      state.error = "";
      state.activeSearchRequestId = null;
      state.activeBookingRequestId = null;
      clearFareState(state);
    },
    clearSelectedFare(state) {
      state.selectedFare = null;
      state.seatDetails = null;
      state.fareRulesWarning = "";
      state.seatError = "";
      state.verificationStatus = "idle";
      state.seatStatus = "idle";
      state.activeVerificationRequestId = null;
      state.activeSeatRequestId = null;
      state.loadingFareId = "";
    },
    resetFlightBooking: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchFlights.pending, (state, action) => {
        state.searchStatus = "pending";
        state.activeSearchRequestId = action.meta.requestId;
        state.searchContext = null;
        state.bookingResult = null;
        state.error = "";
        clearFareState(state);
      })
      .addCase(searchFlights.fulfilled, (state, action) => {
        if (state.activeSearchRequestId !== action.meta.requestId) return;
        state.searchStatus = "succeeded";
        state.searchContext = action.payload;
        state.activeSearchRequestId = null;
      })
      .addCase(searchFlights.rejected, (state, action) => {
        if (state.activeSearchRequestId !== action.meta.requestId) return;
        state.searchStatus = "failed";
        state.error = action.payload || "Flight search failed. Check the route and dates, then try again.";
        state.activeSearchRequestId = null;
      })
      .addCase(loadFlightFares.pending, (state, action) => {
        state.fareStatus = "pending";
        state.fareDetailsStatus = "pending";
        state.activeFareRequestId = action.meta.requestId;
        state.loadingFareId = action.meta.arg.searchFlightId;
        state.fareDetails = null;
        state.fareOptions = [];
        state.selectedFare = null;
        state.error = "";
      })
      .addCase(loadFlightFares.fulfilled, (state, action) => {
        if (state.activeFareRequestId !== action.meta.requestId) return;
        state.fareStatus = "succeeded";
        state.fareDetailsStatus = "succeeded";
        state.fareDetails = action.payload;
        state.fareOptions = action.payload.options;
        state.loadingFareId = "";
        state.activeFareRequestId = null;
      })
      .addCase(loadFlightFares.rejected, (state, action) => {
        if (state.activeFareRequestId !== action.meta.requestId) return;
        state.fareStatus = "failed";
        state.fareDetailsStatus = "failed";
        state.error = action.payload || "Fare details failed. Choose another result or search again.";
        state.loadingFareId = "";
        state.activeFareRequestId = null;
      })
      .addCase(selectFlightFare.pending, (state, action) => {
        state.fareStatus = "pending";
        state.verificationStatus = "pending";
        state.activeVerificationRequestId = action.meta.requestId;
        state.loadingFareId = action.meta.arg.fareOption.bookingFlightId;
        state.selectedFare = null;
        state.seatDetails = null;
        state.fareRulesWarning = "";
        state.error = "";
      })
      .addCase(selectFlightFare.fulfilled, (state, action) => {
        if (state.activeVerificationRequestId !== action.meta.requestId) return;
        state.fareStatus = "succeeded";
        state.verificationStatus = "succeeded";
        state.selectedFare = action.payload;
        state.fareRulesWarning = action.payload.fareRulesWarning;
        state.loadingFareId = "";
        state.activeVerificationRequestId = null;
      })
      .addCase(selectFlightFare.rejected, (state, action) => {
        if (state.activeVerificationRequestId !== action.meta.requestId) return;
        state.fareStatus = "failed";
        state.verificationStatus = "failed";
        state.error = action.payload || "Fare verification failed. Choose another fare or search again.";
        state.loadingFareId = "";
        state.activeVerificationRequestId = null;
      })
      .addCase(loadFlightSeats.pending, (state, action) => {
        state.seatStatus = "pending";
        state.activeSeatRequestId = action.meta.requestId;
        state.seatDetails = null;
        state.seatError = "";
      })
      .addCase(loadFlightSeats.fulfilled, (state, action) => {
        if (state.activeSeatRequestId !== action.meta.requestId) return;
        state.seatStatus = "succeeded";
        state.seatDetails = action.payload;
        state.activeSeatRequestId = null;
      })
      .addCase(loadFlightSeats.rejected, (state, action) => {
        if (state.activeSeatRequestId !== action.meta.requestId) return;
        state.seatStatus = "failed";
        state.seatError = action.payload || "Seat details failed. Review passenger details and retry.";
        state.activeSeatRequestId = null;
      })
      .addCase(submitFlightBooking.pending, (state, action) => {
        state.bookingStatus = "pending";
        state.activeBookingRequestId = action.meta.requestId;
        state.error = "";
      })
      .addCase(submitFlightBooking.fulfilled, (state, action) => {
        if (state.activeBookingRequestId !== action.meta.requestId) return;
        state.bookingStatus = "succeeded";
        state.bookingResult = action.payload;
        state.activeBookingRequestId = null;
      })
      .addCase(submitFlightBooking.rejected, (state, action) => {
        if (action.meta.condition) return;
        if (state.activeBookingRequestId !== action.meta.requestId) return;
        state.bookingStatus = "failed";
        state.error = action.payload || "Final booking failed. Verify the fare and retry.";
        state.activeBookingRequestId = null;
      });
  },
});

export const {
  clearFlightError,
  clearFareRulesWarning,
  clearSeatDetails,
  clearFareDetails,
  clearSearch,
  clearSelectedFare,
  resetFlightBooking,
} = flightBookingSlice.actions;

export default flightBookingSlice.reducer;
