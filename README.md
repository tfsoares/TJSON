# TJSON

TJSON stands for Templated JSON. It consists in an algorithm to compress the data by reducing the amount of verbose of the repeated objects in arrays that use JSON objects with the same structure.

It aims to allow data compression by turning JSON objects into arrays. For every JSON object (and sub-Object), it indexes object keys in an array and then groups the data without keys in another.
```Javascript
// simple example
{
    key1: "data1",
    key2: "data2"
}
// turns into
[
    ["key1", "key2"],
    ["data1", "data2"]
]
```
One of the characteristics of the algorithm is recursivity. When given an object, it will index as above and do the same to sub-objects.

Let's see a more complex example.

#### JSON
```JSON
{
	"id": 7,
	"tags": ["programming", "javascript"],
	"author": {
		"name": "me",
		"year": 2014
	},
	"users": [{
		"first": "Homer",
		"last": "Simpson"
	}, {
		"first": "Hank",
		"last": "Hill"
	}, {
		"first": "Peter",
		"last": "Griffin"
	}],
	"books": [{
		"title": "JavaScript",
		"author": "Flanagan",
		"year": 2006
	}, {
		"title": "Cascading Style Sheets",
		"author": "Meyer",
		"year": 2004
	}]
};
```
#### TJSON
```JSON
[
	["id", "tags", "users", "books"],
	[
		7, ["programming", "javascript"],
		[
			["first", "last"],
			["Homer", "Simpson", "Hank", "Hill", "Peter", "Griffin"]
		],
		[
			["title", "author", "year"],
			["JavaScript", "Flanagan", 2006, "Cascading Style Sheets", "Meyer", 2004]
		]
	]
]
```

Even after compression, the output will be parseable Javascript, even usable if interpreted the right way.

### Translator (Proof of Concept)
Here is a prototype of a translator that allows to access data even before decompression.
```Javascript
var Translator = function(data) {
	return function(index) {
		return (!index && data) || new translator(isNaN(index) ? data[1][data[0].indexOf(index)] : [data[0], data[1].slice(data[0].length * index, data[1].length)]);
	};
```
Here is the usage of this translator:
``` Javascript
var translator = new translator(tjson_data);

console.log(tjson_data("users")(2)("last")()); // returns equivalent of json_data["users"][2]["last"]
```
There could be much more funcionality added to this translator/interpreter. As it is, it remains only as a proof of concept of the algorithm needed to do it.
## Todo's

 - Ensure that the first object schema is true across other objects in array
 - Turn script into NPM module
 - Make it into CLI utility
 - Write Tests