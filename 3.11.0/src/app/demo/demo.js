require('./foo');
require('./bar');

alert('demo.js');

if (process.env.NODE_ENV !== 'production') {
    alert('Looks like we are in development mode!');
}

export class A {}