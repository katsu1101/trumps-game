import {Card as CardType} from '@/types/card';
import Card               from './Card';

type Props = {
  cards: CardType[];
};

export default function CardGrid({cards}: Props) {
  const rows = [0, 1, 2, 3]; // 4行

  return (
    <div className="grid gap-2">
      {rows.map(rowIndex => (
        <div key={rowIndex} className="grid grid-cols-13 gap-2">
          {cards.slice(rowIndex * 13, (rowIndex + 1) * 13).map(card => (
            <Card key={card.id} card={card}/>
          ))}
        </div>
      ))}
    </div>
  );
}
