import { run } from '../src';
run(process.argv)
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(process.exit);
