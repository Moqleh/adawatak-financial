export default function RootPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#031a33',
        color: '#fff',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <p>جاري فتح أدواتك المالية…</p>
      <script
        dangerouslySetInnerHTML={{
          __html:
            "window.location.replace('/adawatak-financial/ar/');",
        }}
      />
      <noscript>
        <meta
          httpEquiv="refresh"
          content="0;url=/adawatak-financial/ar/"
        />
      </noscript>
    </main>
  );
}
