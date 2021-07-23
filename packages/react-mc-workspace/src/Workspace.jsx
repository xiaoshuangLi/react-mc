import React, {
  useMemo,
  createRef,
} from 'react';
import classnames from 'classnames';

import Collection from './Collection';

import { CollectionsContext, StateContext, useUsing } from './utils/hooks';

const { Provider: CollectionsProvider } = CollectionsContext;
const { Provider: StateProvider } = StateContext;

const Workspace = React.forwardRef((props = {}, ref) => {
  const { className, children, ...others } = props;

  const cls = classnames({
    'react-mc-workspace-render': true,
    [className]: !!className,
  });

  ref = useMemo(() => {
    return ref || createRef();
  }, [ref]);

  const collectionsValue = useUsing([]);
  const stateValue = useUsing({ root: ref });

  return (
    <CollectionsProvider value={collectionsValue}>
      <StateProvider value={stateValue}>
        <Collection root>
          <div ref={ref} className={cls} {...others}>
            { children }
          </div>
        </Collection>
      </StateProvider>
    </CollectionsProvider>
  );
});

export default Workspace;
