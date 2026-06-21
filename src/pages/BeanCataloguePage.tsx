import { useState } from "react";
import BeanBag from "../components/BeanBag";
import { beans } from "../data/beans";
import { loadLocalBrews } from "../lib/brewStorage";
import {
  deleteLocalBean,
  loadLocalBeans,
  updateLocalBean,
} from "../lib/beanStorage";
import "../styles/coffee.css";
import "../styles/beanCatalogue.css";

export default function BeanCataloguePage() {
  const [localBeans, setLocalBeans] = useState(loadLocalBeans);
  const localBrews = loadLocalBrews();

  const allBeans = [...localBeans, ...beans];

  const currentBeans = allBeans.filter((bean) => bean.status === "current");

  function refreshLocalBeans() {
    setLocalBeans(loadLocalBeans());
  }

  function markBeanFinished(beanId: string) {
    const bean = localBeans.find((currentBean) => currentBean.id === beanId);

    if (!bean) {
      return;
    }

    updateLocalBean({
      ...bean,
      status: "finished",
      remaining: "0g",
    });

    refreshLocalBeans();
  }

  function deleteBean(beanId: string) {
    const hasRelatedBrew = localBrews.some((brew) => brew.beanId === beanId);

    if (hasRelatedBrew) {
      window.alert(
        "This bean cannot be deleted because one or more local brews use it. Delete those brews first, or mark this bean as finished instead.",
      );

      return;
    }

    const confirmed = window.confirm(
      "Delete this local bean? This cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    deleteLocalBean(beanId);
    refreshLocalBeans();
  }

  return (
    <main className="coffeePage beanCataloguePage">
      <section className="beanCatalogueShell">
        <header className="beanCatalogueHeader">
          <div>
            <p className="coffeeEyebrow">snoopboopsnoop coffee</p>
            <h1>Bean catalogue</h1>
            <p>
              A shelf of the coffees currently at home, with origin details,
              roast info, and tasting notes.
            </p>
          </div>

          <div className="beanCatalogueHeaderActions">
            <a className="coffeeButton" href="/coffee/beans/new">
              Add bean
            </a>

            <a className="coffeeButton beanCatalogueBackButton" href="/coffee">
              Back to coffee
            </a>
          </div>
        </header>

        <section className="beanShelf" aria-label="Current coffee beans">
          {currentBeans.map((bean) => {
            const isLocal = localBeans.some((localBean) => localBean.id === bean.id);

            return (
              <BeanBag
                key={bean.id}
                bean={bean}
                isLocal={isLocal}
                onMarkFinished={markBeanFinished}
                onDelete={deleteBean}
              />
            );
          })}
        </section>
      </section>
    </main>
  );
}