import React, {
  useMemo,
  useEffect,
  useContext,
} from 'react';

import {
  ModeContext,
  ExtractionsContext,
  ExtractableContext,
} from './hooks';

const { Provider: ModeProvider } = ModeContext;

export const withMode = (ComponentClass) => React.forwardRef((props = {}, ref) => {
  const { mode, ...others } = props;

  if (mode !== undefined) {
    return (
      <ModeProvider value={mode}>
        <ComponentClass ref={ref} {...others} />
      </ModeProvider>
    );
  }

  return (
    <ComponentClass ref={ref} {...others} />
  );
});

export const withExtraction = (ComponentClass) => React.forwardRef((props = {}, ref) => {
  const { children, ...others } = props;

  const extractable = useContext(ExtractableContext);
  const [extractions, setExtractions] = useContext(ExtractionsContext);

  const denpencies = Object.values(others);
  const extraction = useMemo(() => {
    return { ComponentClass, props: others };
  }, denpencies);

  const more = useMemo(() => {
    if (extractable) {
      return {};
    }

    if (!extractions) {
      return {};
    }

    const found = extractions.find(
      (item = {}) => item.ComponentClass === ComponentClass,
    ) || {};

    return found.props || {};
  }, [extractable, extractions]);

  useEffect(() => {
    if (!extractable) {
      return;
    }

    if (!setExtractions) {
      return;
    }

    setExtractions((prevExtractions = []) => {
      return prevExtractions.concat(extraction);
    });

    return () => {
      setExtractions((prevExtractions = []) => {
        const included = prevExtractions.includes(extraction);

        if (included) {
          return prevExtractions.filter(
            (item) => item !== extraction,
          );
        }

        return prevExtractions;
      });
    };
  }, [extractable, setExtractions, extraction]);

  if (extractable) {
    return null;
  }

  return (
    <ComponentClass ref={ref} {...props} {...more} />
  );
});
