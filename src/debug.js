"use strict";

function debugOutput(...args) {
  if (false) {
    console.log(`PocketToots ${new Date().toJSON()}:`, ...args);
  }
}
