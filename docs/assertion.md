# Assertions

Create an assertion within your scenario's "next" blocks like this:

```javascript
this.assert(myValue)
```

You can also specify a message first, to override Flagpole's attempt at creating a default assertion method. That way it is really descriptive of what that assertion checks for.

```javascript
this.assert('Make sure my value is a number', myValue)
```

This alone does nothing, since it just creates the assertion object with the value you want to assert against. But it hasn't actually asserted anything. So use one of the methods below.

## Methods

All methods return the Assertion itself, unless otherwise noted.

### between(min: number, max: number): Assertion

Works for numbers, but also casts strings to numbers for the compare. Tests if this value is between the minimum and maximum.

```javascript
this.assert(myValue).between(0, 10);
```

### contains(value: any): Assertion

Tests whether the input value contains the argument. This works for strings, arrays, and even for objects. If it's an object, it checks if a property exists with that value.

```javascript
this.assert('foobar').contains('foo');
```

### endsWith(value: any): Assertion

Tests whether the input value ends with the argument. Also works with arrays, testing whether the argument is the last value of the array.

```javascript
this.assert('foobar').endsWith('bar');
```

### equals(value: any): Assertion

This be used with any types of values. It uses a rough (double equals) equality versus the exactly method that uses a precise (triple equals) equality.

```javascript
this.assert(myValue).equals(5);
```

### every(callback: Function): Assertion

Loops throught the input value, which should be an array, and checks them against the callback function to be sure that every one is true.

```javascript
this.assert(['eminem', 'dre', 'ice cube']).every((rapper) => {
  return rapper.indexOf('e') >= 0;
})
```

### exactly(value: any): Assertion

This asserts an exact match with precise (triple equals) equality.

```javascript
this.assert(myValue).exactly(5);
```

### exists(): Assertion

Tests whether the input value is not null or undefined. This works well for selecting a DOM Element and then testing if it actually existed (since it returns null if not).

```javascript
this.assert(await this.select('article')).exists();
```

### greaterThan(value: number): Assertion

Works for numbers, but also casts strings to numbers for the compare.

```javascript
this.assert(myValue).greaterThan(5);
```

### greaterThanOrEquals(value: number): Assertion

Works for numbers, but also casts strings to numbers for the compare.

```javascript
this.assert(myValue).greaterThanOrEquals(5);
```

### in(listOfValues: any[]): Assertion

Tests whether the input value is in the array of possible values.

```javascript
this.assert('2pac').in(['2pac', 'biggie', 'daz']);
```

### includes(value: any): Assertion

Tests whether the input array includes the argument.

```javascript
this.assert(['2pac', 'biggie', 'daz']).includes('2pac');
```

### lessThan(value: number): Assertion

Works for numbers, but also casts strings to numbers for the compare.

```javascript
this.assert(myValue).lessThan(5);
```

### lessThanOrEquals(value: number): Assertion

Works for numbers, but also casts strings to numbers for the compare.

```javascript
this.assert(myValue).lessThanOrEquals(5);
```

### like(value: string): Assertion

Like is a more fuzzy match. It ignores type differences and also trims whitespace and compares strings all lowercase. So it indicates the values are similar, but not necessarily equal.

```javascript
this.assert(myValue).like('FooBar');
```

### matches(pattern: RegExp | string): Assertion

Regular express compare of strings.

```javascript
this.assert(myValue).matches(/^[a-z0-9]{3,32}$/i);
```

### none(callback: Function): Assertion

Loops throught the input value, which should be an array, and checks them against the callback function to be sure that none are true.

```javascript
this.assert(['2pac', 'biggie', 'daz']).none((rapper) => {
  return rapper == 'snoop';
})
```

### rejects(): Assertion

Tests whether the input promise rejects.

```javascript
await this.assert(myPromise).rejects();
```

### resolves(): Assertion

Tests whether the input promise resolves.

```javascript
await this.assert(myPromise).resolves();
```

### some(callback: Function): Assertion

Loops throught the input value, which should be an array, and checks them against the callback function to be sure that at least one is true.

```javascript
this.assert(['dre', 'snoop', '2pac']).some((rapper) => {
  return rapper.indexOf('e') >= 0;
})
```

### startsWith(value: any): Assertion

Tests whether the input value starts with the argument. Also works with arrays, testing whether the argument is the first value of the array.

```javascript
this.assert(['foo', 'bar']).startsWith('foo');
```

## Properties

In addition to the methods to make the assertions, you can change them by chaining these properties.

### length: Assertion

This causes the assertion to evaluate the length of the input value, rather than the actual value. This works for anything that supports length including strings and arrays. For other things it will cast the input to a string and evaluate it.

```javascript
this.assert('foobar').length.equals(6);
```

### not: Assertion

Flips the assertion to be the negative of itself.

```javascript
this.assert(5).not.equals(6);
```

### optional: Assertion

This makes the assertion consider optional, meaning its failure won't cause the entire scenario to fail. If it passes, it will be listed as a pass. If it fails, it will be shown as failing in a special type of comment. That way you can see it, but not hold up the deploy because of it.

```javascript
this.assert(5).optional.equals(6);
```

### type: Assertion

This causes the assertion to evaluate the type of the value, rather than the actual input value. The type will always be a lowercase string. It is a smart typeof that can tell things like 'promise' and 'regexp' that might otherewise evaluate to plain old object.

```javascript
this.assert(5).type.equals('number');
```