import HomePage from "./pages/HomePage";
import CoffeePage from "./pages/CoffeePage";
import BrewJournalPage from "./pages/BrewJournalPage";
import BeanCataloguePage from "./pages/BeanCataloguePage";
import AddBrewPage from "./pages/AddBrewPage";
import AddBeanPage from "./pages/AddBeanPage";
import EditBeanPage from "./pages/EditBeanPage";
import EditBrewPage from "./pages/EditBrewPage";

export default function App() {
  const path = window.location.pathname;

  if (path === "/coffee") {
    return <CoffeePage />;
  }

  if (path === "/coffee/journal/new") {
    return <AddBrewPage />;
  }

  if (path.startsWith("/coffee/journal/edit/")) {
    return <EditBrewPage />;
  }

  if (path === "/coffee/journal") {
    return <BrewJournalPage />;
  }

  if (path === "/coffee/beans/new") {
    return <AddBeanPage />;
  }

  if (path.startsWith("/coffee/beans/edit/")) {
    return <EditBeanPage />;
  }

  if (path === "/coffee/beans") {
    return <BeanCataloguePage />;
  }

  return <HomePage />;
}