import styles from './styles.module.scss';
import PreferenceSection from 'components/PreferenceSection';
import { DishType } from 'types/Dish';
import dishTypeMap from 'utils/dishTypeMap';

const StandardMenu: React.FC = () => {
  const dishTypes: DishType[] = ['PRIMARY', 'SECONDARY', 'SIDE', 'DRINK'];
  return (
    <div className={styles.container}>
      <main className={styles.body}>
        {dishTypes.map((type) => (
          <PreferenceSection key={type} title={dishTypeMap[type]} />
        ))}
      </main>
    </div>
  );
};

export default StandardMenu;
