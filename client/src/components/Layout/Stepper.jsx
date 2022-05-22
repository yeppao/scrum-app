import { Steps } from 'primereact/steps';

const interactiveItems = [
  { label: 'Connexion'},
  { label: 'Selection du projet'},
  { label: 'Répartition des tâches'},
  { label: 'Rédaction de la conception'},
  { label: 'Présentation de la conception'},
  { label: 'Création des tâches'},
  { label: 'Présentation des tâches'},
];

const Stepper = ({ step }) => (
  <Steps model={interactiveItems} activeIndex={step} readOnly />
);

export default Stepper;
