class HashMap {
    constructor(initialCapacity = 16, loadFactor = 0.75) {
      // The array that will hold our key-value pairs (buckets)
      this.buckets = new Array(initialCapacity).fill(null);
      
      // Maximum ratio of filled slots to total slots before resizing
      this.loadFactor = loadFactor;
      
      // Current number of stored key-value pairs
      this.size = 0;
      
      // Current capacity of the hash map (number of buckets)
      this.capacity = initialCapacity;
    }
  
    // Generates a hash code for a given string key
    hash(key) {
      if (typeof key !== 'string') {
        throw new Error('Only string keys are supported');
      }
  
      let hashCode = 0;
      const primeNumber = 31;
      
      // Apply modulo in each iteration to prevent integer overflow
      for (let i = 0; i < key.length; i++) {
        hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % this.capacity;
      }
      
      return hashCode;
    }
  
    // Sets or updates a key-value pair in the hash map
    set(key, value) {
      // Calculate load to check if we need to resize
      const currentLoad = this.size / this.capacity;
      
      // If load exceeds loadFactor, double the capacity
      if (currentLoad >= this.loadFactor) {
        this.resize();
      }
  
      const index = this.hash(key);
      
      // If bucket is empty, create new node
      if (this.buckets[index] === null) {
        this.buckets[index] = [];
      }
  
      // Check if key already exists in bucket (handling collisions)
      for (let i = 0; i < this.buckets[index].length; i++) {
        if (this.buckets[index][i][0] === key) {
          // Update existing value
          this.buckets[index][i][1] = value;
          return;
        }
      }
  
      // Add new key-value pair to bucket
      this.buckets[index].push([key, value]);
      this.size++;
    }
  
    // Retrieves value associated with given key
    get(key) {
      const index = this.hash(key);
      
      if (this.buckets[index] === null) {
        return null;
      }
  
      // Search through bucket for matching key
      for (const pair of this.buckets[index]) {
        if (pair[0] === key) {
          return pair[1];
        }
      }
      
      return null;
    }
  
    // Checks if key exists in hash map
    has(key) {
      const index = this.hash(key);
      
      if (this.buckets[index] === null) {
        return false;
      }
  
      // Search through bucket for key
      return this.buckets[index].some(pair => pair[0] === key);
    }
  
    // Removes key-value pair from hash map
    remove(key) {
      const index = this.hash(key);
      
      if (this.buckets[index] === null) {
        return false;
      }
  
      // Find and remove key-value pair
      const bucket = this.buckets[index];
      const pairIndex = bucket.findIndex(pair => pair[0] === key);
      
      if (pairIndex === -1) {
        return false;
      }
  
      bucket.splice(pairIndex, 1);
      this.size--;
      
      // If bucket is empty, set to null
      if (bucket.length === 0) {
        this.buckets[index] = null;
      }
      
      return true;
    }
  
    // Returns number of stored key-value pairs
    length() {
      return this.size;
    }
  
    // Removes all entries from hash map
    clear() {
      this.buckets = new Array(this.capacity).fill(null);
      this.size = 0;
    }
  
    // Returns array of all keys
    keys() {
      const allKeys = [];
      
      for (const bucket of this.buckets) {
        if (bucket !== null) {
          for (const pair of bucket) {
            allKeys.push(pair[0]);
          }
        }
      }
      
      return allKeys;
    }
  
    // Returns array of all values
    values() {
      const allValues = [];
      
      for (const bucket of this.buckets) {
        if (bucket !== null) {
          for (const pair of bucket) {
            allValues.push(pair[1]);
          }
        }
      }
      
      return allValues;
    }
  
    // Returns array of all key-value pairs
    entries() {
      const allEntries = [];
      
      for (const bucket of this.buckets) {
        if (bucket !== null) {
          for (const pair of bucket) {
            allEntries.push([pair[0], pair[1]]);
          }
        }
      }
      
      return allEntries;
    }
  
    // Doubles capacity and redistributes existing entries
    resize() {
      const oldBuckets = this.buckets;
      this.capacity *= 2;
      this.buckets = new Array(this.capacity).fill(null);
      this.size = 0;
  
      // Rehash all existing entries into new buckets
      for (const bucket of oldBuckets) {
        if (bucket !== null) {
          for (const [key, value] of bucket) {
            this.set(key, value);
          }
        }
      }
    }
  }