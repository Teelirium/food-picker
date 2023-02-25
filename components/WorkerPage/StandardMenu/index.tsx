import Link from 'next/link';
import { useRouter } from 'next/router';
import { z } from 'zod';

import PreferenceSection from 'components/PreferenceSection';
import { DishType } from 'types/Dish';
import dayMap from 'utils/dayMap';
import dishTypeMap from 'utils/dishTypeMap';
import maxDay from 'utils/maxDay';
import dayOfWeekSchema from 'utils/schemas/dayOfWeekSchema';

import styles from './styles.module.scss';

const paramSchema = z.object({
  day: dayOfWeekSchema.default(0),
});

const dishTypes: DishType[] = ['PRIMARY', 'SECONDARY', 'SIDE', 'DRINK'];

const StandardMenu: React.FC = () => {
  const router = useRouter();
  const { day } = paramSchema.parse(router.query);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <ul>
          {dayMap.slice(0, maxDay).map((d, i) => (
            <Link key={d} href={{ pathname: router.basePath, query: { day: i } }} shallow>
              <li aria-current={day === i}>{d}</li>
            </Link>
          ))}
        </ul>
        {/* <span>Видеоинструкция</span> */}
      </header>
      <main className={styles.body}>
        {dishTypes.map((type) => (
          <PreferenceSection key={type} title={dishTypeMap[type]} />
        ))}
      </main>
      <footer className={styles.footer}>(Меню повторяется каждую неделю)</footer>
    </div>
  );
};

export default StandardMenu;
