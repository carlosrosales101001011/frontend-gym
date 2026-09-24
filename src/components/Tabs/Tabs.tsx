import { Children, isValidElement, useState } from "react";
import type { ReactElement, ReactNode, SyntheticEvent } from "react";
import classNames from "classnames";
import { Tab as RBTab, Tabs as RBTabs } from "react-bootstrap";
import type { TabsProps as RBTabsProps } from "react-bootstrap";
import type { TabProps } from "./Tab";

export interface TabsProps extends Omit<RBTabsProps, "children"> {
  children?: ReactNode;
  classNameActive?: string;
  classNameInactivos?: string;
}

export const Tabs = ({
  children,
  activeKey,
  defaultActiveKey,
  onSelect,
  classNameActive,
  classNameInactivos,
  ...rest
}: TabsProps) => {
  const tabs = Children.toArray(children).filter(isValidElement) as ReactElement<TabProps>[];

  const [uncontrolledActiveKey, setUncontrolledActiveKey] = useState(
    defaultActiveKey ?? tabs[0]?.props.eventKey
  );

  const isControlled = activeKey !== undefined;
  const currentActiveKey = isControlled ? activeKey : uncontrolledActiveKey;

  const handleSelect = (eventKey: string | null, event: SyntheticEvent<unknown>) => {
    if (!isControlled) {
      setUncontrolledActiveKey(eventKey ?? undefined);
    }
    onSelect?.(eventKey, event);
  };

  return (
    <RBTabs {...rest} activeKey={currentActiveKey} onSelect={handleSelect}>
      {tabs.map((tab) => {
        const { tabClassName, eventKey, ...tabProps } = tab.props;
        const isActive = eventKey === currentActiveKey;

        return (
          <RBTab
            key={eventKey}
            eventKey={eventKey}
            tabClassName={classNames(tabClassName, isActive ? classNameActive : classNameInactivos)}
            {...tabProps}
          />
        );
      })}
    </RBTabs>
  );
};
