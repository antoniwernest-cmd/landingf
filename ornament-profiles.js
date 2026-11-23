/* Each ornament keeps the storage key of the ID it replaces. */
(() => {
 const names = [
  'Red bauble', 'Gold star', 'Candy cane', 'Snowy tree', 'Purple snowflake',
  'Christmas stocking', 'Gold bell', 'Gingerbread person', 'Blue gift', 'Snowman',
  'Wreath', 'Mitten', 'Sleigh', 'Striped icicle', 'Reindeer',
  'Penguin', 'Santa hat', 'Gold trumpet', 'Silver moon', 'Cardinal'
 ];
 const base = new URL('assets/november-homework/', document.currentScript.src);
 window.ML_ORNAMENTS = window.ML_PROFILES.map(([id], index) => ({
  id, name: names[index], src: new URL('ornament-' + (index + 1) + '.png', base).href
 }));
 window.ML_PROFILES = ML_ORNAMENTS.map(({id, name}) => [id, name]);
})();
