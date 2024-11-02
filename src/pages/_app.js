import "@/styles/globals.css";
import { MathJaxContext } from 'better-react-mathjax';

export default function MyApp({ Component, pageProps }) {
  return (
    <MathJaxContext config={{
      loader: { load: ["input/asciimath"] },
      asciimath: {
        displaystyle: true,
      },
    }}>
      <Component {...pageProps} />
    </MathJaxContext>
  );
}
