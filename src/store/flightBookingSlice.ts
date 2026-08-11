import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getErrorMessage } from "@/lib/api/client";
import {
  flightService,
  type FlightBookingPayload,
  type FlightSearchPayload,
} from "@/lib/api/flights";

export type JsonRecord = Record<string, unknown>;

export type FlightSearchContext = {
  searchSession: number;
  refId: string;
  fallbackFlightId: string;
  flights: JsonRecord[];
};

export type SelectedFlightFare = {
  searchFlightId: string;
  bookingFlightId: string;
  flight: JsonRecord;
  fareDetails: JsonRecord;
  priceDetails: JsonRecord;
  fareRules: JsonRecord | null;
};

type RequestStatus = "idle" | "pending" | "succeeded" | "failed";

type FlightBookingState = {
  searchContext: FlightSearchContext | null;
  selectedFare: SelectedFlightFare | null;
  bookingResult: JsonRecord | null;
  searchStatus: RequestStatus;
  fareStatus: RequestStatus;
  bookingStatus: RequestStatus;
  loadingFareId: string;
  error: string;
  activeSearchRequestId: string | null;
  activeFareRequestId: string | null;
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

const extractFlights = (providerResponse: unknown): JsonRecord[] => {
  if (Array.isArray(providerResponse)) {
    return providerResponse.map(asRecord).filter((item): item is JsonRecord => Boolean(item));
  }
  const provider = asRecord(providerResponse);
  const direct = firstArray(provider, ["results", "flights", "flightResults", "flightList"]);
  if (direct.length) return direct.map(asRecord).filter((item): item is JsonRecord => Boolean(item));
  const nested = asRecord(provider?.data);
  return firstArray(nested, ["results", "flights", "flightResults", "flightList"])
    .map(asRecord)
    .filter((item): item is JsonRecord => Boolean(item));
};

export const searchFlights = createAsyncThunk<FlightSearchContext, FlightSearchPayload, { rejectValue: string }>(
  "flightBooking/search",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await flightService.search(payload);
      if (!response.success) throw new Error(response.message || "Flight search failed.");
      const data = asRecord(response.data);
      const refId = stringValue(data, ["ref_id", "refID"], response.ref_id || "");
      const fallbackFlightId = stringValue(data, ["search_flight_id", "flight_id", "flightID"], response.search_flight_id || "");
      const searchSession = Number(data?.search_session || 0);
      if (!refId || !searchSession) throw new Error("The search response did not include its required reference data.");
      return { searchSession, refId, fallbackFlightId, flights: extractFlights(data?.provider_response) };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const loadFlightFare = createAsyncThunk<
  SelectedFlightFare,
  { refId: string; searchFlightId: string; flight: JsonRecord },
  { rejectValue: string }
>("flightBooking/loadFare", async ({ refId, searchFlightId, flight }, { rejectWithValue }) => {
  try {
    const fareResponse = await flightService.fareDetails(refId, searchFlightId);
    if (!fareResponse.success) throw new Error(fareResponse.message || "Fare details could not be loaded.");
    const fareDetails = asRecord(fareResponse.data) || {};
    const bookingFlightId = fareResponse.booking_flight_id || stringValue(fareDetails, ["booking_flight_id", "flight_id", "flightID"]);
    if (!bookingFlightId) throw new Error("Fare details did not return the booking flight ID.");

    const priceResponse = await flightService.priceVerify(refId, bookingFlightId);
    if (!priceResponse.success) throw new Error(priceResponse.message || "The latest fare could not be verified.");
    const rulesResponse = await flightService.fareRules(refId, bookingFlightId).catch(() => null);

    return {
      searchFlightId,
      bookingFlightId,
      flight,
      fareDetails,
      priceDetails: asRecord(priceResponse.data) || {},
      fareRules: rulesResponse?.success ? asRecord(rulesResponse.data) : null,
    };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const submitFlightBooking = createAsyncThunk<JsonRecord, FlightBookingPayload, { rejectValue: string }>(
  "flightBooking/book",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await flightService.book(payload);
      if (!response.success) throw new Error(response.message || "Flight booking failed.");
      return asRecord(response.data) || {};
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const initialState: FlightBookingState = {
  searchContext: null,
  selectedFare: null,
  bookingResult: null,
  searchStatus: "idle",
  fareStatus: "idle",
  bookingStatus: "idle",
  loadingFareId: "",
  error: "",
  activeSearchRequestId: null,
  activeFareRequestId: null,
};

const flightBookingSlice = createSlice({
  name: "flightBooking",
  initialState,
  reducers: {
    clearFlightError(state) { state.error = ""; },
    clearSearch(state) {
      state.searchContext = null;
      state.selectedFare = null;
      state.bookingResult = null;
      state.error = "";
      state.activeSearchRequestId = null;
      state.activeFareRequestId = null;
      state.loadingFareId = "";
    },
    clearSelectedFare(state) {
      state.selectedFare = null;
      state.activeFareRequestId = null;
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
        state.selectedFare = null;
        state.bookingResult = null;
        state.error = "";
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
        state.error = action.payload || "Flight search failed.";
        state.activeSearchRequestId = null;
      })
      .addCase(loadFlightFare.pending, (state, action) => {
        state.fareStatus = "pending";
        state.activeFareRequestId = action.meta.requestId;
        state.loadingFareId = action.meta.arg.searchFlightId;
        state.error = "";
      })
      .addCase(loadFlightFare.fulfilled, (state, action) => {
        if (state.activeFareRequestId !== action.meta.requestId) return;
        state.fareStatus = "succeeded";
        state.selectedFare = action.payload;
        state.loadingFareId = "";
        state.activeFareRequestId = null;
      })
      .addCase(loadFlightFare.rejected, (state, action) => {
        if (state.activeFareRequestId !== action.meta.requestId) return;
        state.fareStatus = "failed";
        state.error = action.payload || "Fare details could not be loaded.";
        state.loadingFareId = "";
        state.activeFareRequestId = null;
      })
      .addCase(submitFlightBooking.pending, (state) => {
        state.bookingStatus = "pending";
        state.error = "";
      })
      .addCase(submitFlightBooking.fulfilled, (state, action: PayloadAction<JsonRecord>) => {
        state.bookingStatus = "succeeded";
        state.bookingResult = action.payload;
      })
      .addCase(submitFlightBooking.rejected, (state, action) => {
        state.bookingStatus = "failed";
        state.error = action.payload || "Flight booking failed.";
      });
  },
});

export const { clearFlightError, clearSearch, clearSelectedFare, resetFlightBooking } = flightBookingSlice.actions;
export default flightBookingSlice.reducer;
