# `react-mc-workspace`

Easy to build your own visual programming tool, just like [Scratch-Blocks](https://github.com/LLK/scratch-blocks) or Apple Shortcut.

All we do is provide one way to modify ```value``` intuitivly and conveniently.

[Basic Demo](https://codesandbox.io/s/react-mc-workspace-basic-1bu1s)

[Apple Shortcut like Demo](https://codesandbox.io/s/react-mc-workspace-apple-shortcut-qeyww)

```js
/**
 *  value example
 *  
 *  type: string, just like the name of function.
 *  value: array, just like the arguments of function.
 *
 */
const value = [
  {
    type: 'alert',
    value: ['I have a dream.'],
  },
  {
    type: 'alert',
    value: [
      {
        type: 'get_value',
        value: ['message'],
      },
    ],
  },
];
```

## Installation

Using [npm](https://www.npmjs.com/):

    $ npm install --save react-mc-workspace

## Usage

### Don't Panic.

```jsx
import React, { useState } from 'react';

import Workspace, {
  Creations,
  Decoration,
  Definition,
  ArgumentInput,
  ArgumentSelect,
} from 'react-mc-workspace';

const initialArguments = ['name'];

const initialValue = [
  {
    type: 'set_value',
    value: initialArguments,
  },
];

const options = [
  { label: 'name', value: 'name' },
  { label: 'sex', value: 'sex' },
  { label: 'age', value: 'age' },
];

const useArgument = (props, index = 0) => {
  const { value = [], onChange } = props;

  const argument = value[index];
  const setArgument = (nextArgument) => {
    const nextValue = value.slice();

    nextValue[index] = nextArgument;
    onChange && onChange(nextValue);
  };

  return onChange
    ? [argument, setArgument]
    : [argument];
};

/**
 *  How to define ComponentClass for type.
 *  
 *  1. Decoration: To use common style.
 *  2. ArgumentSelect: To modify the special argument in value.
 *
 */
const GetValueCreation = (props = {}) => {
  const [key, setKey] = useArgument(props, 0);

  const title = (
    <>
      Get
      <ArgumentSelect
        placeholder="Please select key"
        options={options}
        value={key}
        onChange={setKey}
      />
    </>
  );

  return (
    <Decoration icon="🗒" title={title} />
  );
};

const SetValueCreation = (props = {}) => {
  const [key, setKey] = useArgument(props, 0);
  const [value, setValue] = useArgument(props, 1);

  const title = (
    <>
      Get
      <ArgumentSelect
        placeholder="Please select key"
        options={options}
        value={key}
        onChange={setKey}
      />
      <ArgumentInput
        placeholder="Please input value"
        value={value}
        onChange={setValue}
      />
    </>
  );

  return (
    <Decoration icon="✏️" title={title} />
  );
};

const AlertCreation = (props = {}) => {
  const [content, setContent] = useArgument(props, 0);

  const title = (
    <>
      Alert
      <ArgumentInput
        placeholder="Please input content"
        value={content}
        onChange={setContent}
      />
    </>
  );

  return (
    <Decoration icon="📢" title={title} />
  );
};

/**
 *  How to use Workspace
 *  
 *  1. Workspace: To store definitions in context.
 *  2. Definition: To define ComponentClass for type.
 *  3. Creations: To modify the value you got. Value should be array.
 *
 */
const App = (props = {}) => {
  const [value, setValue] = useState(initialValue);

  return (
    <Workspace style={{ padding: 15 }}>
      <Definition type="alert" ComponentClass={AlertCreation} />
      <Definition type="set_value" value={initialArguments} ComponentClass={SetValueCreation} />
      <Definition output type="get_value" value={initialArguments} ComponentClass={GetValueCreation} />
      <Creations placeholder="Click To Create" value={value} onChange={setValue} />
    </Workspace>
  );
};

export default App;

```

## Documentation

### Workspace

Store ```Definitions``` in context.Just render all other components under ```Workspace```.

### Definition

Define properties of special type.

#### Definition.output: boolean

Indicates whether the type of value can used as argument.

```jsx
import React, { useState } from 'react';

import Workspace, {
  Creations,
  Definition,
} from 'react-mc-workspace';

/**
 *
 * output type "get_value" use as argument.
 *
 * const value = [{
 *   type: 'alert',
 *   value: [
 *     {
 *       type: 'get_value',
 *       value: ['message'],
 *     },
 *   ],
 * }]
 */

const AlertCreation = () => { ... };
const GetValueCreation = () => { ... };

const App = () => {
  const [value, setValue] = useState([]);

  return (
    <Workspace>
      <Definition type="alert" ComponentClass={AlertCreation} />
      <Definition output type="get_value" ComponentClass={GetValueCreation} />
      <Creations value={value} onChange={setValue} />
    </Workspace>
  );
}
```

#### Definition.ComponentClass: elemntType

The way you render for special type.Should support ```value```, ```onChange```;

```jsx
import React, { useState, useEffect } from 'react';

import Workspace, {
  Creations,
  Definition,
} from 'react-mc-workspace';

const initialValue = [
  {
    type: 'alert',
    value: ['I have a dream'],
  },
];

const AlertCreation = (props = {}) => {
  const { value = [], onChange } = props;

  useEffect(() => {
    // Got value: ['I have a dream']
    console.log('Got value: ', value);

    onChange && onChange(['I still have a dream.']);
  }, []);

  return (...);
};

const App = () => {
  const [value, setValue] = useState(initialValue);

  return (
    <Workspace>
      <Definition type="alert" ComponentClass={AlertCreation} />
      <Creations value={value} onChange={setValue} />
    </Workspace>
  );
}
```

### Collection

To sort ```Definition```;

#### Collection.type: string

#### Collection.title: string

```jsx
import React from 'react';

import Workspace, {
  Collection,
  Definition,
} from 'react-mc-workspace';

const App = () => {
  return (
    <Workspace>
      <Collection type="event">
        <Definition type="on_click" {...} />
        <Definition type="on_change" {...} />
      </Collection>
      <Collection type="command">
        <Definition type="alert" {...} />
        <Definition type="reload" {...} />
      </Collection>
      {...}
    </Workspace>
  );
};
```

### Decoration

The common style for ```Definition.ComponentClass```.

#### Decoration.icon: node

#### Decoration.title: node

#### Decoration.children: node

```jsx
import React from 'react';

import Workspace, {
  Decoration,
  ArgumentInput,
} from 'react-mc-workspace';

const AlertCreation = (props = {}) => {
  const { value = [], onChange: propsOnChange } = props;
  
  const onChange = (current) => {
    propsOnChange && propsOnChange([current]);
  };

  const title = (
    <>
      Get
      <ArgumentInput value={value[0]} onChange={onChange} />
    </>
  );

  return (
    <Decoration icon="📢" title={title} />
  );
};
```

### ArgumentInput

#### ArgumentInput.placeholder: node

#### ArgumentInput.value: string | object

```jsx
const stringValue = '';
const objectValue = { type: '', value: [] };
```

#### ArgumentInput.onChange: func

### ArgumentSelect

#### ArgumentSelect.placeholder: node

#### ArgumentSelect.options: array

```jsx
/**
 * label: node
 * value: string
 */
const options = [
  { label: 'One', value: '1' },
  { label: 'Two', value: '2' },
];
```

#### ArgumentSelect.value: string

#### ArgumentSelect.onChange: func

### ArgumentSwitch

#### ArgumentSwitch.value: boolean

#### ArgumentSwitch.onChange: func

### ArgumentCreations

#### ArgumentCreations.placeholder: node

#### ArgumentCreations.value: array

```jsx
const value = [
  { type: '', value: [] },
  { type: '', value: [] },
];
```

#### ArgumentCreations.onChange: func

### Creation

#### Creation.mode: "icon" | "text" | "article"

* **icon:** ```Decoration``` only show ```icon```.
* **text:** ```Decoration``` only show ```title```.
* **article:** ```Decoration``` only show ```icon``` and ```title```.

#### Creation.value: array

#### Creation.onChange: func

### Creations

#### Creations.placeholder: node

#### Creations.mode: "icon" | "text" | "article"

* **icon:** ```Decoration``` only show ```icon```.
* **text:** ```Decoration``` only show ```title```.
* **article:** ```Decoration``` only show ```icon``` and ```title```.

#### Creations.value: array

```jsx
const value = [
  { type: '', value: [] },
  { type: '', value: [] },
];
```

#### Creations.onChange: func

### Selector

Show useful ```Definitions``` to select.

#### Selector.compact: boolean

Show with compact style.

#### Selector.output: boolean

If ```true```, only show output ```Definitions```.

#### Selector.conditions: array

Set conditions to filter ```Definitions```.
Array of object or function, ```[{ key: value }, (defnition) => boolean]```.

```jsx
import React from 'react';

import Workspace, {
  Selector,
  Creations,
  Collection,
  Definition,
  ArgumentInput,
  ArgumentCreations,
} from 'react-mc-workspace';

const conditions = [
  { role: 'mission' },
  { type: ['on_click', 'get_value'] },
  (defnition = {}) => {
    return defnition.type === 'get_value',
  },
];

const App = () => {
  return (
    <Workspace>
      <Definition role="trigger" type="on_click" {...} />
      <Definition role="trigger" type="on_change" {...} />
      <Definition role="mission" type="alert" {...} />
      <Definition output role="mission" type="get_value" {...} />
      <Selector conditions={conditions} />
      <Creations onChange={console.log}>
        <Selector conditions={conditions} />
      </Creations>
      <ArgumentInput onChange={console.log}>
        <Selector conditions={conditions} />
      </ArgumentInput>
      <ArgumentCreations onChange={console.log}>
        <Selector conditions={conditions} />
      </ArgumentCreations>
    </Workspace>
  );
};
```

#### Selector.keywords: string

#### Selector.onSearch: func

#### Selector.onChange: func

Get the ```value``` of ```Defnition```.

```jsx
import React from 'react';

import Workspace, {
  Selector,
  Definition,
} from 'react-mc-workspace';

const App = () => {
  const onChange = (selectedValue = {}) => {
    // Selected value: { type: 'get_value', value: [] }
    console.log('Selected value: ', selectedValue);
  };

  return (
    <Workspace>
      <Definition output type="get_value" {...} />
      <Selector onChange={onChange} />
    </Workspace>
  );
};
```
