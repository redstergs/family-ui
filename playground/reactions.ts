import { familyIcon, type FamilyIconName } from "../src/icons";

function controls(id: string, selected = "", disabled = false, busy = false, count = 0, meal = false) {
  const options: [string, string, FamilyIconName][] = meal
    ? [["liked", "Hat geschmeckt", "thumbs-up"], ["disliked", "Nicht mein Fall", "thumbs-down"], ["not-eaten", "Hab ich nicht gegessen", "utensils-off"]]
    : [["yes", "Zustimmen", "thumbs-up"], ["no", "Ablehnen", "thumbs-down"]];
  return `<div class="fu-reactions" data-reactions="${id}">
    <div class="fu-vote" role="group" aria-label="${meal ? 'Mahlzeitenbewertung' : 'Abstimmung'}" ${busy ? 'aria-busy="true"' : ''}>
      ${options.map(([value, label, icon]) => `<button type="button" class="fu-reaction${value === 'not-eaten' ? ' fu-reaction--neutral' : ''}" data-vote="${value}" aria-label="${label}" title="${label}" aria-pressed="${selected === value}" ${disabled || busy ? 'disabled' : ''}>${familyIcon(icon)}<span class="fu-reaction__selected" aria-hidden="true">✓</span></button>`).join('')}
    </div>
    <button type="button" class="fu-reaction" data-comments aria-label="${count ? count + ' Kommentare öffnen' : 'Kommentare öffnen'}" title="Kommentare öffnen" ${disabled ? 'disabled' : ''}>${familyIcon('message-circle')}${count ? `<span class="fu-reaction__count" aria-hidden="true">${count}</span>` : ''}</button>
  </div>`;
}
export function reactionsExample() {
  return `<section class="fu-section fu-stack"><h1 class="fu-section__title">Abstimmung &amp; Kommentare</h1>
    <p>Interaktive Vorschau mit Beispieldaten. Eine erneute Auswahl nimmt die eigene Stimme zurück.</p>
    <article class="fu-panel fu-stack"><h2>Apfel-Topfen-Müsli mit Walnüssen</h2>
      <p id="vote-status" role="status">Deine Stimme: Noch nicht abgestimmt</p>
      ${controls('interactive', '', false, false, 3)}
      <p id="vote-count">1 von 3 abgestimmt</p><p class="fu-field__hint">Dabei: Barbara, Julia, Philipp</p>
    </article>
    <article class="fu-panel fu-stack"><h2>Mahlzeitenbewertung</h2>
      <p id="meal-rating-status" role="status">Deine Auswahl: Noch keine Bewertung</p>
      ${controls('meal-rating', '', false, false, 0, true)}
      <p class="fu-field__hint">„Hab ich nicht gegessen“ ist keine Geschmacksbewertung. Ein Kommentar ist bei jeder Auswahl freiwillig.</p>
    </article>
    <article class="fu-panel fu-stack"><h2>Zugestimmt</h2>${controls('yes', 'yes')}<p>Deine Stimme: Zugestimmt</p></article>
    <article class="fu-panel fu-stack"><h2>Abgelehnt</h2>${controls('no', 'no')}<p>Deine Stimme: Abgelehnt</p></article>
    <article class="fu-panel fu-stack"><h2>Deaktiviert</h2>${controls('disabled', 'yes', true)}<p>Abstimmung abgeschlossen</p></article>
    <article class="fu-panel fu-stack"><h2>Speichern</h2>${controls('busy', 'yes', false, true)}<p role="status">Stimme wird gespeichert …</p></article>
    <dialog class="fu-dialog" id="reaction-comments" aria-labelledby="reaction-comments-title"><h2 id="reaction-comments-title">Kommentare · Beispiel</h2><p>Barbara: Bitte mit Zimt.</p><p>Julia: Walnüsse bitte separat.</p><p>Philipp: Ist eingeplant.</p><form method="dialog"><button class="fu-button" autofocus>Schließen</button></form></dialog>
  </section>`;
}
export function bindReactions(doc: Document) {
  doc.querySelectorAll<HTMLElement>('[data-reactions]').forEach(group => {
    group.querySelectorAll<HTMLButtonElement>('[data-vote]').forEach(button => {
      button.onclick = () => {
        const selected = button.getAttribute('aria-pressed') !== 'true';
        group.querySelectorAll('[data-vote]').forEach(item => item.setAttribute('aria-pressed', String(item === button && selected)));
        if (group.dataset.reactions === 'meal-rating') {
          doc.querySelector('#meal-rating-status')!.textContent = 'Deine Auswahl: ' + (selected ? button.getAttribute('aria-label') : 'Noch keine Bewertung');
        }
        if (group.dataset.reactions === 'interactive') {
          doc.querySelector('#vote-status')!.textContent = 'Deine Stimme: ' + (selected ? button.dataset.vote === 'yes' ? 'Zugestimmt' : 'Abgelehnt' : 'Noch nicht abgestimmt');
          doc.querySelector('#vote-count')!.textContent = (selected ? '2' : '1') + ' von 3 abgestimmt';
        }
      };
    });
    const trigger = group.querySelector<HTMLButtonElement>('[data-comments]');
    if (trigger) trigger.onclick = () => {
      const dialog = doc.querySelector<HTMLDialogElement>('#reaction-comments')!;
      dialog.onclose = () => trigger.focus();
      dialog.showModal();
    };
  });
}
