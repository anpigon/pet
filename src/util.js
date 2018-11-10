function util() {
}

util.parseFloat = function (v) {
  return parseFloat(v.split(' ')[0]);
};

util.formatterVestingSteem = function (vestingShares, global) {
  // console.log('formatterVestingSteem1', vestingShares, global)
  // console.log('formatterVestingSteem2', global.totalVestingFundSteem, this.parseFloat(vestingShares), global.totalVestingShares)
  // console.log('formatterVestingSteem3', global.totalVestingFundSteem * (this.parseFloat(vestingShares) / global.totalVestingShares))
  return global.totalVestingFundSteem * (this.parseFloat(vestingShares) / global.totalVestingShares);
};

export default util;
