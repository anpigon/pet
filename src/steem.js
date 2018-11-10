import steem from 'steem';

const author = 'guest123';
const permlink = 'safrijals';

function vote(author, permlink, voter, wifs) {
  console.log(`@${voter} vote => @${author}/${permlink}`);
  return steem.broadcast.sendAsync({
    extensions: [],
    operations: [
      ['vote', {
        voter,
        author,
        permlink,
        weight: 10000,
      }],
    ] }, wifs);
}

function comment(username, wif, data) {
  console.log(`@${voter} comment => @${author}/${permlink}`);
  return steem.broadcast.commentAsync(
    wif,
    author, // Parent Author
    permlink, // Parent Permlink
    username, // Author
    new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase(), // Permlink
    'pet/0.0.1', // Title
    '', // Body
    { tags: ['test'], app: 'steemjs/examples' });
}

async function findUsername(username) {
  const lookupResults = await steem.api.lookupAccountsAsync(username, 1);
  return lookupResults.includes(username);
}

// 오늘 하루 이력 불러오기
// - 보팅 이력이 있는지 검사...
const BLOCK = 25501947;
const FIND_OPS = [/* 'comment','vote' */, 'custom_json'];
const TODAY = new Date(`${new Date().toDateString()} 00`);
const history = [];
let his_next = null;
async function findHistory(next) {
  // console.log('next1', next);
  his_next = null;
  const his = await steem.api.getAccountHistoryAsync('guest123', (next || -1), 10).then(r => r.filter(([id, e]) => { his_next = (his_next || id); return FIND_OPS.includes(e.op[0]); }).map(([_, e]) => e));
  // console.log('his', his.length)
  if (!history || !next) history = [];
  history = his.concat(history);
  // console.log('b', his[0].block, his[0].block < block);
  // console.log('t', new Date(his[0].timestamp + 'Z'), new Date(his[0].timestamp + 'Z') < tday);
  if (his[0].block < BLOCK || new Date(`${his[0].timestamp}Z`) < TODAY) {
    console.log('end');
    return history;
  }
  // console.log('next2', this.ghis.n);
  return await findHistory(his_next - 1);
}
// await ghis()
// steem.api.streamOperations((e, r) => console.log(e, r)) // op 모니터링한다.

export default {
  vote,
  comment,
  findHistory,
};
