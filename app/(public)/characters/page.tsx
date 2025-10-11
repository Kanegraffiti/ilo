import type { Metadata } from 'next';

import CharacterGallery, { type CharacterProfile } from './CharacterGallery';

const characters: CharacterProfile[] = [
  {
    name: 'Adé',
    image: '/images/Ade.png',
    tagline: 'Ọmọ ìlú Ìlọ̀ tí ń kọ́ ìtàn tuntun lojoojúmọ́',
    catchphrase: 'Ẹ jẹ́ ká kọ́ Yorùbá papọ̀!'
  },
  {
    name: 'Bidẹ́mí',
    image: '/images/Bidemi.png',
    tagline: 'Arákùnrin onígboyà tí ó fẹ́ràn orin àlùfáà',
    catchphrase: 'Mo ṣetan fún ìrìn àjò tuntun!'
  },
  {
    name: 'Ìrẹ́tí',
    image: '/images/1760205755825.png',
    tagline: 'Ayọ̀kẹ́lẹ̀ onímọ̀ràn tó ń ràn ọ̀rẹ́ lọ́wọ́',
    catchphrase: 'Ìfẹ́ àti ìfẹ̀sọ́nà ni kó wa jọ.'
  },
  {
    name: 'Ọlá',
    image: '/images/1760205862949.png',
    tagline: 'Akẹ́kọ̀ọ́ olóye tí ń kọ́ ìtàn àròsọ fún ẹbí',
    catchphrase: 'Ẹ gbọ́ ìtàn mi tuntun?'
  },
  {
    name: 'Morẹ́nikẹ́',
    image: '/images/1760206019097.png',
    tagline: 'Ọmọbìnrin onírẹ̀lẹ̀ tó ní ìmísí ìròyìn ayọ̀',
    catchphrase: 'Ẹ rìn-in, ẹ rẹrìn-ín!'
  },
  {
    name: 'Tàíwò',
    image: '/images/1760206474049.png',
    tagline: 'Ọ̀rẹ́ oníṣeré tí ń kọ́ gbogbo ènìyàn sí orúkọ wọn',
    catchphrase: 'Jẹ́ ká kéde orúkọ rẹ lẹ́wa!'
  },
  {
    name: 'Kẹ́hìndé',
    image: '/images/1760207319347.png',
    tagline: 'Onítàn ìjàpá tí ń bínú sí ìkùnà kíákíá',
    catchphrase: 'A kì í yára ṣubú, a máa dákẹ́!'
  }
];

export const metadata: Metadata = {
  title: 'Ìlọ̀ Characters',
  description: 'Meet the Yorùbá cartoon heroes of Ìlọ̀ and learn their playful taglines.'
};

export default function CharactersPage() {
  return (
    <div className="space-y-10 rounded-3xl bg-surface-1/80 p-6 shadow-sm shadow-black/5 md:p-10">
      <CharacterGallery characters={characters} />
    </div>
  );
}
