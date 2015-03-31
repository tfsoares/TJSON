var tjson = {
	encode: function(data) {
		var schemas = {}, maxSchemaIndex = 0;

		function encodeArray(data) {
			var i, encoded = [];
			for (i = 0; i < data.length; i++) {
				encoded = encoded.concat(encode(data[i]));
			}
			return encoded;
		}

		function encodeObject(data) {
			var keys = Object.keys(data),
				i, k, encoded = [keys, []];

			for (i = 0; i < keys.length; i++) {
				var current = encode(data[keys[i]]);
				if (Array.isArray(current) && Array.isArray(current[0])) {
					for (k = 2; k < current.length;) {
						if (current.length % 2 !== 0)
							current[1] = current[1].concat(current[2]);
						current.splice(2, 1);
					}
				}
				encoded[1].push(current);
			}
			return encoded;
		}

		function encode(data) {
			if (typeof data !== 'object' || !data) {
				return data;
			} else if (Array.isArray(data)) {
				return encodeArray(data);
			} else {
				return encodeObject(data);
			}
		}

		return encode(data);

	},
	decode: function(data) {
		function isArray(data) {
			return Object.prototype.toString.call(data) === "[object Array]";
		}

		function decode(data) {
			if (isArray(data) && isArray(data[0])) {
				var array = [],
					data_size = data[1].length / data[0].length;

				for (var i = 0; i < data_size; i++) {
					var current = {}, length = data[0].length;

					for (var k = 0; k < length; k++) {
						current[data[0][k]] = decode(data[1][i * length + k]);
					}
					array.push(current);
				}
				return array.length > 1 ? array : array[0];
			} else {
				return data;
			}
		}
		return decode(data);
	}
};

if (module && module.exports)
	module.exports = tjson;