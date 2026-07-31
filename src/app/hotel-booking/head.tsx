export default function Head() {
  return (
    <>
      <title>Complete Hotel Reservation | Booking Hospitality</title>
      <style>{`
        body {
          overflow: hidden;
        }

        body > main {
          flex: none !important;
          height: calc(100dvh - 5rem);
          min-height: 0 !important;
          overflow: hidden;
        }

        body > footer {
          display: none;
        }

        body > main > div[class~="min-h-screen"] {
          height: 100%;
          min-height: 0 !important;
          overflow: hidden;
          padding-top: 1rem !important;
          padding-bottom: 1rem !important;
          background:
            radial-gradient(circle at 8% 12%, rgba(19, 165, 216, .11), transparent 24rem),
            radial-gradient(circle at 92% 88%, rgba(6, 31, 59, .07), transparent 28rem),
            #f3f8fb;
        }

        body > main > div[class~="min-h-screen"] > main {
          display: flex;
          height: 100%;
          min-height: 0;
          flex-direction: column;
        }

        body > main > div[class~="min-h-screen"] > main > a {
          flex: none;
          width: fit-content;
          border-radius: 999px;
          background: rgba(255, 255, 255, .88);
          padding: .55rem .9rem;
          box-shadow: 0 6px 22px rgba(6, 31, 59, .08);
          backdrop-filter: blur(10px);
        }

        body > main > div[class~="min-h-screen"] > main > div {
          display: flex !important;
          min-height: 0;
          flex: 1;
          flex-direction: column;
          margin-top: .75rem !important;
          border: 1px solid rgba(8, 125, 189, .13);
          border-radius: 1.75rem !important;
          background: white;
          box-shadow: 0 24px 75px rgba(6, 31, 59, .14) !important;
        }

        body > main > div[class~="min-h-screen"] aside {
          position: relative;
          z-index: 1;
          flex: none;
          overflow: hidden;
          padding: 1rem 1.25rem !important;
          background:
            radial-gradient(circle at 90% 5%, rgba(19, 165, 216, .3), transparent 16rem),
            linear-gradient(150deg, #061f3b 0%, #07345d 100%) !important;
        }

        body > main > div[class~="min-h-screen"] aside::after {
          position: absolute;
          right: -2.5rem;
          bottom: -3.5rem;
          width: 10rem;
          height: 10rem;
          content: "";
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 999px;
          box-shadow: 0 0 0 1.8rem rgba(255,255,255,.025), 0 0 0 3.6rem rgba(255,255,255,.018);
        }

        body > main > div[class~="min-h-screen"] aside > span,
        body > main > div[class~="min-h-screen"] aside > p,
        body > main > div[class~="min-h-screen"] aside > div {
          display: none;
        }

        body > main > div[class~="min-h-screen"] aside h1 {
          position: relative;
          z-index: 2;
          margin-top: 0 !important;
          overflow: hidden;
          font-size: 1.55rem !important;
          line-height: 1.2 !important;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        body > main > div[class~="min-h-screen"] form {
          min-height: 0;
          flex: 1;
          overflow-x: hidden;
          overflow-y: auto;
          overscroll-behavior: contain;
          scroll-behavior: smooth;
          scrollbar-color: #8bcce5 #edf6fa;
          scrollbar-width: thin;
          padding: 1.25rem !important;
          background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
        }

        body > main > div[class~="min-h-screen"] form::-webkit-scrollbar {
          width: 8px;
        }

        body > main > div[class~="min-h-screen"] form::-webkit-scrollbar-track {
          border-radius: 999px;
          background: #edf6fa;
        }

        body > main > div[class~="min-h-screen"] form::-webkit-scrollbar-thumb {
          border: 2px solid #edf6fa;
          border-radius: 999px;
          background: #69b7d8;
        }

        body > main > div[class~="min-h-screen"] form > h2 {
          position: sticky;
          top: -1.25rem;
          z-index: 15;
          margin: -1.25rem -1.25rem 0 !important;
          border-bottom: 1px solid rgba(15, 23, 42, .07);
          padding: 1.15rem 1.25rem .9rem;
          background: rgba(255, 255, 255, .96);
          box-shadow: 0 8px 24px rgba(6, 31, 59, .04);
          backdrop-filter: blur(14px);
          font-size: 1.7rem !important;
        }

        body > main > div[class~="min-h-screen"] form > div:first-of-type {
          margin-top: 1rem !important;
        }

        body > main > div[class~="min-h-screen"] form input,
        body > main > div[class~="min-h-screen"] form select,
        body > main > div[class~="min-h-screen"] form textarea {
          transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
        }

        body > main > div[class~="min-h-screen"] form label:focus-within > span:last-child,
        body > main > div[class~="min-h-screen"] form input:focus,
        body > main > div[class~="min-h-screen"] form select:focus,
        body > main > div[class~="min-h-screen"] form textarea:focus {
          border-color: rgba(19, 165, 216, .75) !important;
          box-shadow: 0 0 0 4px rgba(19, 165, 216, .1) !important;
          background: #fff !important;
        }

        body > main > div[class~="min-h-screen"] form > section {
          border-color: rgba(8, 125, 189, .13) !important;
          background: linear-gradient(145deg, #f4fafd 0%, #edf7fb 100%) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.9);
        }

        body > main > div[class~="min-h-screen"] form > button:last-of-type {
          position: sticky;
          bottom: -1.25rem;
          z-index: 15;
          margin-right: -1.25rem;
          margin-bottom: -1.25rem;
          margin-left: -1.25rem;
          width: calc(100% + 2.5rem) !important;
          border: 1rem solid rgba(255,255,255,.96);
          border-radius: 1.7rem !important;
          box-shadow: 0 -14px 30px rgba(6, 31, 59, .08), 0 12px 30px rgba(8, 125, 189, .24) !important;
        }

        @media (min-width: 1024px) {
          body > main > div[class~="min-h-screen"] {
            padding-top: 1.25rem !important;
            padding-bottom: 1.25rem !important;
          }

          body > main > div[class~="min-h-screen"] > main > div {
            display: grid !important;
            grid-template-columns: minmax(17rem, .62fr) minmax(0, 1.38fr) !important;
            flex-direction: unset;
            border-radius: 2rem !important;
          }

          body > main > div[class~="min-h-screen"] aside {
            padding: 2.25rem !important;
          }

          body > main > div[class~="min-h-screen"] aside > span {
            display: grid;
          }

          body > main > div[class~="min-h-screen"] aside > p,
          body > main > div[class~="min-h-screen"] aside > div {
            display: block;
          }

          body > main > div[class~="min-h-screen"] aside h1 {
            margin-top: .75rem !important;
            overflow: visible;
            font-size: 2.4rem !important;
            line-height: 1.08 !important;
            white-space: normal;
          }

          body > main > div[class~="min-h-screen"] form {
            padding: 2rem 2.4rem !important;
          }

          body > main > div[class~="min-h-screen"] form > h2 {
            top: -2rem;
            margin: -2rem -2.4rem 0 !important;
            padding: 1.5rem 2.4rem 1rem;
            font-size: 2rem !important;
          }

          body > main > div[class~="min-h-screen"] form > button:last-of-type {
            bottom: -2rem;
            margin-right: -2.4rem;
            margin-bottom: -2rem;
            margin-left: -2.4rem;
            width: calc(100% + 4.8rem) !important;
            border-width: 1.15rem 2.4rem;
          }
        }

        @media (max-height: 720px) and (min-width: 1024px) {
          body > main > div[class~="min-h-screen"] aside > div {
            display: none;
          }

          body > main > div[class~="min-h-screen"] aside h1 {
            font-size: 2rem !important;
          }
        }
      `}</style>
    </>
  );
}
