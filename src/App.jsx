import { useState } from "react";

const COLORS = {
  navy: "#0a1628",
  navyLight: "#0f2040",
  navyMid: "#162d52",
  orange: "#E8881A",
  orangeLight: "#f5a03a",
  white: "#ffffff",
  gray: "#8a9bb5",
  grayLight: "#c5d0e0",
  success: "#22c55e",
  cardBg: "#111f38",
};

const SCENARIOS = [
  {
    label: "Visite enthousiaste",
    note: "Visite avec Thomas et Claire Moreau ce matin, budget 320 000 euros, ils cherchent un T4 avec jardin côté sud. Ils ont adoré le bien rue des Lilas, surtout la cuisine ouverte et la luminosité. Le seul bémol c'est le garage un peu petit. Téléphone de Thomas : 06 12 34 56 78. Ils ont deux enfants, école à proximité important pour eux. Projet dans les 3 mois.",
    fiche: {
      prenom_client: "Thomas",
      nom_client: "Moreau",
      telephone: "06 12 34 56 78",
      type_profil: "acquéreur",
      budget: "320 000 €",
      recherche: "T4 avec jardin côté sud",
      bien_visite: "Maison rue des Lilas",
      ressenti_visite: "Très positif, coup de cœur sur la cuisine et la luminosité",
      points_positifs: "Cuisine ouverte, luminosité, jardin",
      points_negatifs: "Garage trop petit",
      delai_projet: "3 mois",
      niveau_interet: "chaud",
      delai_relance: "J+3",
    },
    sms: "Bonjour Thomas, ravi d'avoir visité la maison rue des Lilas avec vous ce matin ! Cette cuisine ouverte était vraiment un beau coup de cœur 😊 Avez-vous eu le temps d'en discuter avec Claire ?",
  },
  {
    label: "Visite mitigée",
    note: "Rencontre avec Isabelle Fabre, locataire qui veut acheter, budget serré autour de 180 000 euros. Visite du studio rue Gambetta, elle a trouvé ça correct mais le quartier ne lui plaisait pas vraiment. Pas très enthousiaste. Son numéro c'est le 07 98 76 54 32. Elle a dit qu'elle allait réfléchir.",
    fiche: {
      prenom_client: "Isabelle",
      nom_client: "Fabre",
      telephone: "07 98 76 54 32",
      type_profil: "acquéreur",
      budget: "180 000 €",
      recherche: "Studio ou petit appartement",
      bien_visite: "Studio rue Gambetta",
      ressenti_visite: "Mitigé, le bien convenait mais le quartier ne lui plaisait pas",
      points_positifs: "Prix dans le budget, bon état général",
      points_negatifs: "Quartier ne correspond pas aux attentes",
      delai_projet: "Non défini",
      niveau_interet: "tiède",
      delai_relance: "J+7",
    },
    sms: "Bonjour Isabelle, merci pour la visite du studio rue Gambetta 🙂 Je comprends que le quartier vous ait semblé moins idéal. Avez-vous des secteurs particuliers qui vous attirent davantage ?",
  },
  {
    label: "Acheteur chaud",
    note: "Excellent feeling avec Marc Dupuis aujourd'hui ! Il veut acheter rapidement, budget jusqu'à 450 000 euros, coup de cœur total pour l'appartement boulevard Haussmann. Il m'a dit texto qu'il voulait faire une offre. Architecte de profession, il a adoré les volumes et les moulures. Contact : 06 55 44 33 22. Signature envisagée avant fin du mois si possible.",
    fiche: {
      prenom_client: "Marc",
      nom_client: "Dupuis",
      telephone: "06 55 44 33 22",
      type_profil: "acquéreur",
      budget: "450 000 €",
      recherche: "Grand appartement avec cachet haussmannien",
      bien_visite: "Appartement boulevard Haussmann",
      ressenti_visite: "Coup de cœur total, veut faire une offre rapidement",
      points_positifs: "Volumes, moulures, caractère haussmannien",
      points_negatifs: "",
      delai_projet: "Avant fin du mois",
      niveau_interet: "chaud",
      delai_relance: "J+3",
    },
    sms: "Bonjour Marc, quel plaisir de vous avoir fait visiter le boulevard Haussmann aujourd'hui ! Ces moulures et ces volumes sont vraiment exceptionnels 🏛️ Souhaitez-vous qu'on prépare une offre dès cette semaine ?",
  },
];

const niveauConfig = {
  chaud: { color: "#ef4444", label: "🔥 Chaud" },
  tiède: { color: COLORS.orange, label: "⚡ Tiède" },
  froid: { color: COLORS.gray, label: "❄️ Froid" },
};

const PrismeLogo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <svg width="30" height="34" viewBox="0 0 30 34" fill="none">
      <polygon points="15,0 30,26 0,26" fill={COLORS.orange} opacity="0.95" />
      <polygon points="15,7 27,26 3,26" fill={COLORS.navyLight} opacity="0.55" />
    </svg>
    <div>
      <div style={{ color: COLORS.white, fontWeight: 800, fontSize: "15px", letterSpacing: "2px", lineHeight: 1 }}>PRISME</div>
      <div style={{ color: COLORS.orange, fontWeight: 700, fontSize: "10px", letterSpacing: "3px", lineHeight: 1.5 }}>SOLUTIONS</div>
    </div>
  </div>
);

const Badge = ({ text, color }) => (
  <span style={{
    background: color + "22", color, border: `1px solid ${color}44`,
    borderRadius: "20px", padding: "3px 10px", fontSize: "11px",
    fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase",
  }}>{text}</span>
);

const Field = ({ label, value, full }) => (
  <div style={{
    gridColumn: full ? "1 / -1" : "auto",
    background: COLORS.navy, borderRadius: "10px", padding: "12px 14px",
  }}>
    <div style={{ color: COLORS.gray, fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "4px" }}>
      {label}
    </div>
    <div style={{ color: COLORS.white, fontSize: "14px", lineHeight: "1.5" }}>{value}</div>
  </div>
);

export default function App() {
  const [note, setNote] = useState("");
  const [step, setStep] = useState("input"); // input | animating | done
  const [stepIdx, setStepIdx] = useState(0);
  const [result, setResult] = useState(null);

  const steps = [
    "Analyse du compte-rendu vocal…",
    "Extraction des informations client…",
    "Génération du SMS personnalisé…",
  ];

  const findScenario = (text) => {
    return SCENARIOS.find(s => s.note === text) || null;
  };

  const runDemo = async () => {
    if (!note.trim()) return;
    const scenario = findScenario(note);
    setStep("animating");
    setStepIdx(0);

    for (let i = 0; i < 3; i++) {
      setStepIdx(i);
      await new Promise(r => setTimeout(r, 900 + i * 200));
    }

    setResult(scenario || SCENARIOS[0]);
    setStep("done");
  };

  const reset = () => {
    setNote("");
    setStep("input");
    setStepIdx(0);
    setResult(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.navy, fontFamily: "'Inter', -apple-system, sans-serif", color: COLORS.white }}>
      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${COLORS.navyMid}`, padding: "16px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: COLORS.navyLight,
      }}>
        <PrismeLogo />
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.success, boxShadow: `0 0 8px ${COLORS.success}` }} />
          <span style={{ color: COLORS.gray, fontSize: "13px" }}>Agent IA actif — Sophie Martin · IAD</span>
        </div>
      </div>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px" }}>
        {/* Hero */}
        <div style={{ marginBottom: "36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <div style={{ width: "3px", height: "28px", background: COLORS.orange, borderRadius: "2px" }} />
            <h1 style={{ margin: 0, fontSize: "26px", fontWeight: 800, letterSpacing: "-0.5px" }}>Zéro lead perdu</h1>
          </div>
          <p style={{ margin: 0, color: COLORS.gray, fontSize: "14px", paddingLeft: "13px" }}>
            L'agent IA qui transforme vos comptes-rendus de visite en fiches clients et SMS de relance automatiques.
          </p>
        </div>

        {/* INPUT */}
        {step === "input" && (
          <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.navyMid}`, borderRadius: "16px", padding: "28px", marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
              <h2 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: COLORS.grayLight }}>🎙️ Compte-rendu de visite</h2>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {SCENARIOS.map((s, i) => (
                  <button key={i} onClick={() => setNote(s.note)} style={{
                    background: note === s.note ? COLORS.orange + "33" : COLORS.navyMid,
                    border: `1px solid ${note === s.note ? COLORS.orange + "66" : COLORS.navyMid}`,
                    borderRadius: "8px", color: note === s.note ? COLORS.orange : COLORS.grayLight,
                    fontSize: "11px", padding: "5px 10px", cursor: "pointer", fontWeight: 600,
                  }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Ex : Visite avec Thomas et Claire Moreau, budget 320 000€, T4 avec jardin... Téléphone : 06 12 34 56 78"
              style={{
                width: "100%", minHeight: "130px",
                background: COLORS.navy,
                border: `1px solid ${note ? COLORS.orange + "44" : COLORS.navyMid}`,
                borderRadius: "10px", color: COLORS.white, fontSize: "14px",
                lineHeight: "1.6", padding: "14px", resize: "vertical",
                outline: "none", fontFamily: "inherit", boxSizing: "border-box",
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
              <button onClick={runDemo} disabled={!note.trim()} style={{
                background: note.trim() ? `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.orangeLight})` : COLORS.navyMid,
                color: note.trim() ? COLORS.white : COLORS.gray,
                border: "none", borderRadius: "10px", padding: "13px 28px",
                fontSize: "14px", fontWeight: 700, cursor: note.trim() ? "pointer" : "not-allowed",
              }}>
                → Générer la fiche + SMS
              </button>
            </div>
          </div>
        )}

        {/* ANIMATION */}
        {step === "animating" && (
          <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.navyMid}`, borderRadius: "16px", padding: "32px" }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: i < 2 ? "20px" : 0 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                  background: i < stepIdx ? COLORS.success : i === stepIdx ? COLORS.orange : COLORS.navyMid,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", fontWeight: 700,
                  boxShadow: i === stepIdx ? `0 0 14px ${COLORS.orange}88` : "none",
                  transition: "all 0.4s",
                }}>
                  {i < stepIdx ? "✓" : i + 1}
                </div>
                <span style={{
                  color: i < stepIdx ? COLORS.success : i === stepIdx ? COLORS.white : COLORS.gray,
                  fontSize: "14px", fontWeight: i === stepIdx ? 600 : 400,
                }}>
                  {s}
                  {i === stepIdx && <span style={{ marginLeft: 8, display: "inline-block", animation: "blink 1s infinite" }}>●</span>}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* RESULTS */}
        {step === "done" && result && (
          <>
            {/* Fiche */}
            <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.navyMid}`, borderRadius: "16px", padding: "28px", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "22px", flexWrap: "wrap", gap: "10px" }}>
                <h2 style={{ margin: 0, fontSize: "15px", fontWeight: 700 }}>📋 Fiche lead créée dans Airtable</h2>
                <div style={{ display: "flex", gap: "8px" }}>
                  <Badge text={result.fiche.type_profil} color={COLORS.orange} />
                  <Badge text={niveauConfig[result.fiche.niveau_interet].label} color={niveauConfig[result.fiche.niveau_interet].color} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <Field label="Client" value={`${result.fiche.prenom_client} ${result.fiche.nom_client}`} />
                <Field label="Téléphone" value={result.fiche.telephone} />
                <Field label="Budget" value={result.fiche.budget} />
                <Field label="Délai projet" value={result.fiche.delai_projet} />
                <Field label="Bien visité" value={result.fiche.bien_visite} full />
                <Field label="Recherche" value={result.fiche.recherche} full />
                {result.fiche.points_positifs && <Field label="Points positifs" value={result.fiche.points_positifs} full />}
                {result.fiche.points_negatifs && <Field label="Points négatifs" value={result.fiche.points_negatifs} full />}
                <Field label="Ressenti" value={result.fiche.ressenti_visite} full />
              </div>
              <div style={{
                marginTop: "16px", background: COLORS.orange + "15",
                border: `1px solid ${COLORS.orange}33`, borderRadius: "10px",
                padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px",
              }}>
                <span style={{ fontSize: "16px" }}>📅</span>
                <span style={{ color: COLORS.orange, fontSize: "14px", fontWeight: 600 }}>
                  SMS de relance programmé à {result.fiche.delai_relance} — envoi automatique
                </span>
              </div>
            </div>

            {/* SMS */}
            <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.navyMid}`, borderRadius: "16px", padding: "28px", marginBottom: "20px" }}>
              <h2 style={{ margin: "0 0 20px 0", fontSize: "15px", fontWeight: 700 }}>💬 SMS de relance généré</h2>
              <div style={{ background: COLORS.navy, borderRadius: "12px", padding: "18px" }}>
                <div style={{ background: COLORS.navyMid, borderRadius: "16px 16px 16px 4px", padding: "14px 18px", display: "inline-block", maxWidth: "85%" }}>
                  <p style={{ margin: 0, fontSize: "15px", lineHeight: "1.6" }}>{result.sms}</p>
                </div>
                <div style={{ marginTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: COLORS.gray, fontSize: "12px" }}>{result.sms.length} / 160 caractères · Sophie Martin</span>
                  <span style={{ color: result.sms.length <= 160 ? COLORS.success : "#ef4444", fontSize: "12px", fontWeight: 700 }}>
                    {result.sms.length <= 160 ? "✓ 1 SMS" : "⚠ SMS long"}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div style={{
              background: `linear-gradient(135deg, ${COLORS.orange}18, ${COLORS.navyMid})`,
              border: `1px solid ${COLORS.orange}33`, borderRadius: "16px",
              padding: "24px 28px", display: "flex", alignItems: "center",
              justifyContent: "space-between", flexWrap: "wrap", gap: "16px",
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "4px" }}>Ça vous intéresse ?</div>
                <div style={{ color: COLORS.gray, fontSize: "13px" }}>Ce process tourne automatiquement pour tous vos leads post-visite.</div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={reset} style={{
                  background: COLORS.navyMid, border: `1px solid ${COLORS.navyMid}`,
                  borderRadius: "10px", color: COLORS.grayLight, padding: "10px 18px",
                  fontSize: "13px", fontWeight: 600, cursor: "pointer",
                }}>← Nouvelle démo</button>
                <button onClick={() => window.open("https://calendly.com/contact-prismesolutions/demo-prisme-solutions", "_blank")} style={{
                  background: `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.orangeLight})`,
                  border: "none", borderRadius: "10px", color: COLORS.white,
                  padding: "10px 20px", fontSize: "13px", fontWeight: 700, cursor: "pointer",
                }}>Prendre RDV →</button>
              </div>
            </div>
          </>
        )}
      </div>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        * { box-sizing: border-box; }
        textarea::placeholder { color: #3a4d6a; }
      `}</style>
    </div>
  );
}
