import { useState } from "react";
import type { Bean } from "../types/bean";

type BeanBagProps = {
  bean: Bean;
  isLocal: boolean;
  onMarkFinished: (beanId: string) => void;
  onDelete: (beanId: string) => void;
};

export default function BeanBag({
  bean,
  isLocal,
  onMarkFinished,
  onDelete,
}: BeanBagProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);

  return (
    <article className="beanBag">
      <button
        className={`beanBagInner ${isFlipped ? "beanBagInnerFlipped" : ""}`}
        type="button"
        onClick={() => setIsFlipped(!isFlipped)}
        aria-pressed={isFlipped}
        aria-label={
          isFlipped
            ? `Hide details for ${bean.name}`
            : `Show details for ${bean.name}`
        }
      >
        <div className="beanBagFace beanBagFront">
          <div className="beanBagTop">
            <span>{bean.status}</span>
          </div>

          <div className="beanBagLabel">
            <p>{bean.roaster}</p>
            <h2>{bean.name}</h2>
            <p>
              {bean.origin}
              {bean.region ? ` · ${bean.region}` : ""}
            </p>
          </div>

          <div className="beanBagBottom">
            <span>{bean.process}</span>
            <span>{bean.remaining}</span>
          </div>
        </div>

        <div className="beanBagFace beanBagBack">
          <div className="beanBagBackHeader">
            <p>{bean.roaster}</p>
            <h2>{bean.name}</h2>
          </div>

          <dl className="beanBagInfoGrid">
            <InfoItem label="Farm" value={bean.farm} />
            <InfoItem label="Producer" value={bean.producer} />
            <InfoItem label="Altitude" value={bean.altitude} />
            <InfoItem label="Variety" value={bean.variety} />
            <InfoItem label="Roast" value={bean.roastDate} />
            <InfoItem label="Opened" value={bean.openedDate} />
            <InfoItem label="Size" value={bean.bagSize} />
            <InfoItem label="Left" value={bean.remaining} />
          </dl>

          {bean.tastingNotes && (
            <div className="beanTastingNotes">
              {bean.tastingNotes.map((note) => (
                <span key={note}>{note}</span>
              ))}
            </div>
          )}

          <p className="beanFlipHint">Click to flip back</p>
        </div>
      </button>

      {isLocal && (
        <div className="beanBagManage">
          <button
            className="beanBagManageToggle"
            type="button"
            onClick={() => setIsManageOpen(!isManageOpen)}
            aria-expanded={isManageOpen}
            aria-label={`Manage ${bean.name}`}
          >
            •••
          </button>

          {isManageOpen && (
            <div className="beanBagManageMenu">
              <button
                type="button"
                onClick={() => {
                  window.location.href = `/coffee/beans/edit/${bean.id}`;
                }}
              >
                Edit bean
              </button>

              {bean.status === "current" && (
                <button
                  type="button"
                  onClick={() => {
                    onMarkFinished(bean.id);
                    setIsManageOpen(false);
                  }}
                >
                  Mark finished
                </button>
              )}

              <button
                className="beanBagDeleteButton"
                type="button"
                onClick={() => {
                  onDelete(bean.id);
                  setIsManageOpen(false);
                }}
              >
                Delete bean
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) {
  if (!value) {
    return null;
  }

  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}