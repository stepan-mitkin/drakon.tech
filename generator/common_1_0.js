
function common_1_0_module() {
    var unit = {};
    
    function addRange(src, dst) {
        var _5_col, _5_it, _5_length, item;
        _5_it = 0;
        _5_col = src;
        _5_length = _5_col.length;
        while (true) {
            if (_5_it < _5_length) {
                item = _5_col[_5_it];
                dst.push(item)
                _5_it++;
            } else {
                break;
            }
        }
    }
    
    function comparerAsc(property, left, right) {
        var leftValue, rightValue;
        leftValue = left[property]
        rightValue = right[property]
        if (( typeof leftValue === "string") && ( typeof rightValue === "string")) {
            leftValue = leftValue.toLowerCase()
            rightValue = rightValue.toLowerCase()
        }
        if (leftValue < rightValue) {
            return -1
        } else {
            if (leftValue > rightValue) {
                return 1
            } else {
                return 0
            }
        }
    }
    
    function comparerDesc(property, left, right) {
        var comp;
        comp = comparerAsc(property, left, right)
        return -1 * comp
    }
    
    function deepClone(obj) {
        var visited;
        visited = new Set()
        return deepCloneCore(visited, obj)
    }
    
    function deepCloneCore(visited, obj) {
        var _32_col, _32_it, _32_length, _43_col, _43_it, _43_keys, _43_length, _sw_23, array, copy, item, key, value;
        if ((obj === undefined) || (obj === null)) {
            return undefined
        } else {
            _sw_23 =  typeof obj;
            if (_sw_23 === "number") {
                return obj
            } else {
                if (_sw_23 === "boolean") {
                    return obj
                } else {
                    if (_sw_23 === "string") {
                        return obj
                    } else {
                        if (_sw_23 === "bigint") {
                            return obj
                        } else {
                            if (_sw_23 === "function") {
                                return obj
                            } else {
                                if (_sw_23 === "symbol") {
                                    return obj
                                } else {
                                    if ((obj instanceof RegExp) || (obj instanceof Date)) {
                                        return obj
                                    } else {
                                        if (visited.has(obj)) {
                                            throw new Error(
                                                "deepClone: cycle detected"
                                            )
                                        } else {
                                            visited.add(obj)
                                            if (Array.isArray(obj)) {
                                                array = []
                                                _32_it = 0;
                                                _32_col = obj;
                                                _32_length = _32_col.length;
                                                while (true) {
                                                    if (_32_it < _32_length) {
                                                        item = _32_col[_32_it];
                                                        array.push(deepCloneCore(visited, item))
                                                        _32_it++;
                                                    } else {
                                                        break;
                                                    }
                                                }
                                                return array
                                            } else {
                                                copy = {}
                                                _43_it = 0;
                                                _43_col = obj;
                                                _43_keys = Object.keys(_43_col);
                                                _43_length = _43_keys.length;
                                                while (true) {
                                                    if (_43_it < _43_length) {
                                                        key = _43_keys[_43_it];
                                                        value = _43_col[key];
                                                        copy[key] = deepCloneCore(visited, value)
                                                        _43_it++;
                                                    } else {
                                                        break;
                                                    }
                                                }
                                                return copy
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
    function filterBy(array, property, value) {
        array = array || []
        return array.filter(
            function (item) {
                return item[property] === value
            }
        )
    }
    
    function findBy(array, property, value) {
        var _6_col, _6_it, _6_length, item;
        array = array || []
        _6_it = 0;
        _6_col = array;
        _6_length = _6_col.length;
        while (true) {
            if (_6_it < _6_length) {
                item = _6_col[_6_it];
                if (item[property] === value) {
                    return item
                } else {
                    _6_it++;
                }
            } else {
                return undefined
            }
        }
    }
    
    function last(array) {
        var length;
        if (array) {
            length = array.length
            if (length === 0) {
                return undefined
            } else {
                return array[length - 1]
            }
        } else {
            return undefined
        }
    }
    
    function remove(array, item) {
        var index;
        index = array.indexOf(item)
        if (index === -1) {
        } else {
            array.splice(index, 1)
        }
    }
    
    function sortBy(array, property, direction) {
        var sorter;
        if (array) {
            direction = direction || "asc"
            direction = direction.toLowerCase()
            if (direction === "asc") {
                sorter = comparerAsc
            } else {
                sorter = comparerDesc
            }
            array.sort(
                function (left, right) {
                    return sorter(
                        property,
                        left,
                        right
                    )
                }
            )
        }
    }
    
    function split(text, separator) {
        var notEmpty, parts;
        if (text) {
            parts = text.split(separator)
            notEmpty = function (part) {
                return part.length > 0
            }
            return parts.filter(notEmpty)
        } else {
            return []
        }
    }
    
    
    unit.addRange = addRange;
    unit.deepClone = deepClone;
    unit.filterBy = filterBy;
    unit.findBy = findBy;
    unit.last = last;
    unit.remove = remove;
    unit.sortBy = sortBy;
    unit.split = split;
    return unit;
}

module.exports = common_1_0_module
