"use strict";

var should = require('should');

var PowerTemplate = require('../lib');

global.Ti = {};
global.Ti.UI = {};
global.Ti.UI.createListView = function (cfg) {
  return cfg;
};

describe("APIs", function () {

  it("should have `createListView`", function () {
    PowerTemplate.should.have.property('createListView');
    PowerTemplate.createListView.should.be.a.Function;
  });

  it("should have `createListSection`", function () {
    PowerTemplate.should.have.property('createListSection');
    PowerTemplate.createListView.should.be.a.Function;
  });

  it("should have `createPowerTemplate`", function () {
    PowerTemplate.should.have.property('createPowerTemplate');
    PowerTemplate.createListView.should.be.a.Function;
  });

});

describe("PowerTemplates", function () {

  it("should have a `name`", function () {
    new PowerTemplate({ name: "x" }).should.have.property('name', 'x');
  });

  it("should have a `template`", function () {
    new PowerTemplate({}).should.have.property('template');
  });

  it("should support bracket notation (and filters)", function () {
    new PowerTemplate({
      "name": "x",
      "properties": {
        "itemId": "[ value ]",
        "color": "[ idontexist | or: 'red' ]"
      }
    }).parse({ value: 42 }).should.eql({
      template: 'x',
      properties: {
        itemId: 42,
        color: 'red'
      }
    });
  });

  it("should support function values", function () {
    new PowerTemplate({
      "name": "x",
      "properties": {
        "itemId": function (ctx) { return ctx.value; }
      }
    }).parse({ value: 42 }).should.eql({
      template: 'x',
      properties: {
        itemId: 42
      }
    });
  });

  it("should support function values (with arguments)", function () {
    new PowerTemplate({
      "name": "x",
      "properties": {
        "itemId": function (ctx, bindId, name, listDataItem) {
          return [ctx.value, bindId, name, listDataItem.template].join('/');
        }
      }
    }).parse({ value: 42 }).should.eql({
      template: 'x',
      properties: {
        itemId: "42/properties/itemId/x"
      }
    });
  });

  it("should parse `childTemplates`", function () {
    var powerTemplate = new PowerTemplate({
      "name": "x",
      "properties": {
        "itemId": "[ value ]"
      },
      "childTemplates": [
        {
          "type": "Ti.UI.Label",
          "properties": {
            "text": "[ value ]",
            "color": "[ productId | or: 'red' ]"
          }
        }
      ]
    });

    powerTemplate.template.should.eql({
      name: 'x',
      properties: {},
      childTemplates: [
        {
          type: 'Ti.UI.Label',
          properties: {},
          bindId: '__bindId0'
        }
      ]
    });

    powerTemplate.parse({
      value: 42
    }).should.eql({
      template: 'x',
      properties: {
        itemId: 42
      },
      __bindId0: {
        text: 42,
        color: 'red'
      }
    });
  });

});