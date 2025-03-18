import { About } from "./About";
import { Services } from "./Services";
import { Contact } from "./Contact";
import { Home } from "./Home";
import { Projects } from "./Projects";

export const Base = () => {
  return (
    <div className="flex flex-col w-4/5 mx-auto">
      <Home />
      <About />
      <Services />
      <Projects />
      <Contact />
    </div>
  );
};
