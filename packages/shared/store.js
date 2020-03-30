import React, { useState, useEffect } from 'react';

export const createStore = (initialStore = {}) => {
  let store = initialStore;
  let listeners = [];

  const update = () => {
    listeners.forEach((listener) => {
      listener(store);
    });
  };

  const append = (listener) => {
    if (listeners.includes(listener)) {
      return;
    }

    listeners = listeners.concat(listener);
  };

  const remove = (listener) => {
    listeners = listeners.filter((item) => item !== listener);
  };

  const subscribe = (fn) => {
    append(fn);

    return () => remove(fn);
  };

  const getStore = () => store;

  const setStore = (obj = {}) => {
    if (store === obj) {
      return;
    }

    store = { ...store, ...obj };
    update();
  };

  const resetStore = (obj = {}) => {
    if (store === obj) {
      return;
    }

    store = obj;
    update();
  };

  const useStore = () => {
    const [state = {}, setState] = useState(store);

    useEffect(() => {
      append(setState);

      return () => remove(setState);
    }, []);

    return [state, setStore];
  };

  const withStore = (Comp) => (props = {}) => {
    const [state = {}, setState] = useState(store);

    append(setState);

    useEffect(() => () => remove(setState), []);

    return (
      <Comp {...props} {...state} />
    );
  };

  return {
    subscribe,
    getStore,
    setStore,
    resetStore,
    useStore,
    withStore,
  };
};

export const publicStore = createStore();
export default createStore;
