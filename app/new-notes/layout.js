
import "../globals.css";
import Header from "@/components/header";



export const metadata = {
  title: "DevNotes",
  description: "A mini developer notes/blog application.",
};

export default function RootLayout({ children }) {
  return (<>
  <Header/>
  {children}
  </>
  );
}
