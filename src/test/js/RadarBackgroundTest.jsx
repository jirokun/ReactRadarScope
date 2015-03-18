jest.dontMock('../../main/jsx/components/RadarBackground');

describe('RadarBackground', function() {
  var React = require('react/addons');
  var RadarBackground = require('../../main/jsx/components/RadarBackground');
  var TestUtils = React.addons.TestUtils;
  it('contains 4 circles', function() {
    var categories = [];
    var background = TestUtils.renderIntoDocument(
      <RadarBackground yearMonth="201503" categories={categories} isChildCategory={false}/>
    );
    var circles = TestUtils.scryRenderedDOMComponentsWithTag(background, 'circle');
    expect(circles.length).toBe(4);
  });

  it('contains paths as many as categories', function() {
    var categories = [
      { "displayName": "ABC", "id": 0 },
      { "displayName": "DEF", "id": 1 }
    ];

    var background = TestUtils.renderIntoDocument(
      <RadarBackground yearMonth="201503" categories={categories} isChildCategory={true}/>
    );
    var paths = TestUtils.scryRenderedDOMComponentsWithTag(background, 'path');
    expect(2).toEqual(paths.length);
  });

  it('contains 4 rank-texts', function() {
    var categories = [];
    var background = TestUtils.renderIntoDocument(
      <RadarBackground yearMonth="201503" categories={categories} isChildCategory={false}/>
    );
    var rankTexts = TestUtils.scryRenderedDOMComponentsWithClass(background, 'rank-text');
    expect(rankTexts.length).toBe(4);
    expect('1').toEqual(rankTexts[0].getDOMNode().textContent);
    expect('2').toEqual(rankTexts[1].getDOMNode().textContent);
    expect('3').toEqual(rankTexts[2].getDOMNode().textContent);
    expect('4').toEqual(rankTexts[3].getDOMNode().textContent);
  });

  it('contains texts as many as categories and levels', function() {
    var categories = [
      { "displayName": "ABC", "id": 0 },
      { "displayName": "DEF", "id": 1 }
    ];

    var background = TestUtils.renderIntoDocument(
      <RadarBackground yearMonth="201503" categories={categories} isChildCategory={true}/>
    );
    var texts = TestUtils.scryRenderedDOMComponentsWithClass(background, 'category-label');
    expect(2).toEqual(texts.length);
    expect('ABC').toEqual(texts[0].getDOMNode().textContent);
    expect('DEF').toEqual(texts[1].getDOMNode().textContent);
  });
});
