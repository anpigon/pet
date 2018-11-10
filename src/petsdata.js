const Bytes = function (array) {
  return {
    toString() {
      const str = [];
      for (let i = 0; i < array.length; i++) {
        str.push(String.fromCharCode(array[i]));
      }
      return str.join('');
    },
  };
};

const PET = function ({
  name,
  message,
  color,
  img,
  id,
  wifs,
}) {
  // console.log(name, name.decodeHex());
  return {
    name: name.toString(),
    message: message.toString(),
    id: id.toString(),
    wifs: wifs.map(wif => wif.toString()),
    color,
    img,
    vp: 0,
    remainHours: 0,
    upvoteValue: 0,
    feeding: false,
    about: null,
  };
};

export default [
  new PET({
    name: new Bytes([52488, 47197, 50504, 44221, 44144, 48513, 51060]), // '초록안경거북이'
    // message: '',
    message: new Bytes([50504, 45397, 54616, 49464, 50836, 46, 32, 51200, 45716, 32, 52488, 47197, 50504, 44221, 44144, 48513, 51060, 51077, 45768, 45796, 46, 32, 54609, 53356, 44844, 47532, 46972, 44256, 32, 48520, 47084, 51452, 49492, 46020, 32, 46121, 45768, 45796, 46]), // '안녕하세요. 저는 초록안경거북이입니다. 핑크꼬리라고 불러주셔도 됩니다.',
    color: 'green darken-2',
    img: 'https://steemitimages.com/100x0/https://imgur.com/iHcfHCq.png',
    id: new Bytes([103, 117, 101, 115, 116, 49, 50, 51]), // 'guest123'
    wifs: [new Bytes([53, 74, 82, 97, 121, 112, 97, 115, 120, 77, 120, 49, 76, 57, 55, 90, 85, 88, 55, 89, 117, 67, 53, 80, 115, 98, 53, 69, 65, 98, 70, 56, 50, 49, 107, 107, 65, 71, 116, 66, 106, 55, 120, 67, 74, 70, 81, 99, 98, 76, 103])], // 5JRaypasxMx1L97ZUX7YuC5Psb5EAbF821kkAGtBj7xCJFQcbLg
    enableVote: true,
  }),
  new PET({
    name: new Bytes([48516, 54861, 53664, 45180]), // '분홍토끼',
    message: new Bytes([50504, 45397, 32, 52828, 44396, 50556, 46, 32, 48152, 44032, 50892, 32, 52828, 44396, 50556, 33, 33]), // '안녕 친구야. 반가워 친구야!!',
    id: new Bytes([115, 105, 115, 105, 108, 97, 102, 97, 109, 105, 108, 108, 101]), // 'sisilafamille',
    color: 'pink accent-2',
    img: 'https://steemitimages.com/100x0/https://i.imgur.com/1oSXGkz.png',
    wifs: [new Bytes([53, 75, 50, 76, 65, 50, 117, 99, 83, 56, 98, 49, 71, 117, 70, 118, 86, 103, 90, 75, 54, 105, 116, 75, 78, 69, 54, 102, 70, 77, 98, 68, 77, 88, 52, 71, 68, 116, 78, 72, 105, 99, 122, 74, 69, 83, 76, 71, 82, 100, 56]), new Bytes([53, 74, 82, 97, 121, 112, 97, 115, 120, 77, 120, 49, 76, 57, 55, 90, 85, 88, 55, 89, 117, 67, 53, 80, 115, 98, 53, 69, 65, 98, 70, 56, 50, 49, 107, 107, 65, 71, 116, 66, 106, 55, 120, 67, 74, 70, 81, 99, 98, 76, 103])], // 5K2LA2ucS8b1GuFvVgZK6itKNE6fFMbDMX4GDtNHiczJESLGRd8, 5JRaypasxMx1L97ZUX7YuC5Psb5EAbF821kkAGtBj7xCJFQcbLg
    enableVote: true,
  }),
  new PET({
    name: '네드 스캇',
    message: 'Welcome to Steemit!', // '안녕 친구야. 반가워 친구야!!',
    id: 'ned',
    color: 'blue accent-2',
    img: 'https://steemitimages.com/u/ned/avatar',
    wifs: [],
    enableVote: false,
  }),
];
