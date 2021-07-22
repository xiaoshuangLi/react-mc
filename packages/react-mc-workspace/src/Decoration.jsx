import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { renderBy } from 'shared/utils';

import { useDecoration, useMode } from './utils/hooks';

const DecorationForIcon = React.forwardRef((props = {}, ref) => {
  const { className, icon, ...others } = props;

  const cls = classnames({
    'workspace-decoration-for-icon': true,
    [className]: !!className,
  });

  return renderBy(icon)((
    <div ref={ref} className={cls} {...others}>
      { icon }
    </div>
  ));
});

const DecorationForText = React.forwardRef((props = {}, ref) => {
  const { className, title, ...others } = props;

  const cls = classnames({
    'workspace-decoration-for-text': true,
    [className]: !!className,
  });

  return renderBy(title)((
    <span ref={ref} className={cls} {...others}>
      { title }
    </span>
  ));
});

const DecorationForArticle = React.forwardRef((props = {}, ref) => {
  const {
    className,
    icon,
    title,
    ...others
  } = props;

  const cls = classnames({
    'workspace-decoration-for-article': true,
    [className]: !!className,
  });

  const iconNode = renderBy(icon)((
    <>
      &nbsp;
      <span className="icon">
        { icon }
      </span>
    </>
  ));

  const textNode = renderBy(title)((
    <>
      &nbsp;
      { title }
    </>
  ));

  return renderBy(iconNode || textNode)((
    <span ref={ref} className={cls} {...others}>
      { iconNode }
      { textNode }
    </span>
  ));
});

const DecorationForDefault = React.forwardRef((props = {}, ref) => {
  const {
    className,
    icon,
    title,
    children,
    ...others
  } = props;

  const cls = classnames({
    'workspace-decoration': true,
    [className]: !!className,
  });

  const headerNode = renderBy(icon)((
    <div className="decoration-header">
      { icon }
    </div>
  ));

  const titleNode = renderBy(title)((
    <div className="body-title">
      { title }
    </div>
  ));

  const contentNode = renderBy(children)((
    <div className="body-content">
      { children }
    </div>
  ));

  const bodyNode = renderBy(titleNode || contentNode)((
    <div className="decoration-body">
      { titleNode }
      { contentNode }
    </div>
  ));

  return (
    <div ref={ref} className={cls} {...others}>
      { headerNode }
      { bodyNode }
    </div>
  );
});

const Decoration = React.forwardRef((props = {}, ref) => {
  const mode = useMode();

  const ComponentClass = useMemo(() => {
    if (mode === 'icon') {
      return DecorationForIcon;
    }

    if (mode === 'text') {
      return DecorationForText;
    }

    if (mode === 'article') {
      return DecorationForArticle;
    }

    return DecorationForDefault;
  }, [mode]);

  useDecoration(props);

  return (
    <ComponentClass ref={ref} {...props} />
  );
});

Decoration.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.node,
};

Decoration.defaultProps = {
  icon: null,
  title: null,
};

export default Decoration;
