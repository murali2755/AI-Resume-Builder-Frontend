import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/features";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="page-wrapper fade-in">
      <Navbar />
      <main id="main-content">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}

export default Home;