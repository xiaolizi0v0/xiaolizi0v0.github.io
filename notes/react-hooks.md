# React Hooks 详解

## 什么是 Hooks？
Hooks 是 React 16.8 引入的新特性，让你在不编写 class 的情况下使用 state 以及其他的 React 特性。

## useState
`useState` 用于在函数组件中添加状态。

```javascript
import { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);
    
    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>
                增加
            </button>
            <button onClick={() => setCount(count - 1)}>
                减少
            </button>
        </div>
    );
}
```

## useEffect
`useEffect` 用于处理副作用操作，如数据获取、订阅、手动修改 DOM 等。

```javascript
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        // 获取用户数据
        setLoading(true);
        fetchUser(userId)
            .then(userData => {
                setUser(userData);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    }, [userId]); // 依赖数组
    
    if (loading) return <div>加载中...</div>;
    if (!user) return <div>用户不存在</div>;
    
    return (
        <div>
            <h2>{user.name}</h2>
            <p>Email: {user.email}</p>
        </div>
    );
}
```

## useContext
`useContext` 用于在函数组件中访问 React 的 Context。

```javascript
import { createContext, useContext } from 'react';

const ThemeContext = createContext('light');

function ThemeButton() {
    const theme = useContext(ThemeContext);
    
    return (
        <button className={`btn btn-${theme}`}>
            当前主题: {theme}
        </button>
    );
}
```

## useReducer
`useReducer` 是 useState 的替代方案，适用于复杂的 state 逻辑。

```javascript
import { useReducer } from 'react';

function reducer(state, action) {
    switch (action.type) {
        case 'increment':
            return { count: state.count + 1 };
        case 'decrement':
            return { count: state.count - 1 };
        case 'reset':
            return { count: 0 };
        default:
            throw new Error();
    }
}

function Counter() {
    const [state, dispatch] = useReducer(reducer, { count: 0 });
    
    return (
        <div>
            <p>Count: {state.count}</p>
            <button onClick={() => dispatch({ type: 'increment' })}>
                +
            </button>
            <button onClick={() => dispatch({ type: 'decrement' })}>
                -
            </button>
            <button onClick={() => dispatch({ type: 'reset' })}>
                重置
            </button>
        </div>
    );
}
```

## 自定义 Hooks
你可以创建自己的 Hooks 来复用状态逻辑。

```javascript
import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });
    
    const setValue = (value) => {
        try {
            setStoredValue(value);
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(error);
        }
    };
    
    return [storedValue, setValue];
}

// 使用自定义 Hook
function MyComponent() {
    const [name, setName] = useLocalStorage('name', '');
    
    return (
        <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="请输入姓名"
        />
    );
}
```

## Hooks 使用规则
1. 只在最顶层使用 Hooks
2. 只在 React 函数中调用 Hooks
3. 自定义 Hook 必须以 "use" 开头

## 性能优化
使用 `useMemo` 和 `useCallback` 来优化性能。

```javascript
import { useMemo, useCallback } from 'react';

function ExpensiveComponent({ items, filter }) {
    const filteredItems = useMemo(() => {
        return items.filter(item => item.includes(filter));
    }, [items, filter]);
    
    const handleClick = useCallback(() => {
        console.log('Item clicked');
    }, []);
    
    return (
        <div>
            {filteredItems.map(item => (
                <div key={item} onClick={handleClick}>
                    {item}
                </div>
            ))}
        </div>
    );
}
