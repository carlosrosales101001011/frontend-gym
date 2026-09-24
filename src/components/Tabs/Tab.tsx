import type { TabProps as RBTabProps } from "react-bootstrap";

export type TabProps = RBTabProps;

export const Tab = (_props: TabProps): null => {
  throw new Error(
    "Tab: este componente no debe renderizarse directamente. Solo es válido como hijo directo del componente `Tabs`."
  );
};
