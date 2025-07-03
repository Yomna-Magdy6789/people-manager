const readline = require('readline');
const { promisify } = require('util');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = promisify(rl.question).bind(rl);

class PersonManager {
  constructor() {
    this.people = [];
  }

  async collectPeople(count) {
    for (let i = 0; i < count; i++) {
      console.log(`\nEnter details for person ${i + 1}:`);
      const id = await this.getUniqueId();
      const firstName = await question('First name: ');
      const lastName = await question('Last name: ');
      const age = await this.getValidAge();
      const city = await question('City: ');
      console.log(`Current i value: ${i}, Count: ${count}`);
      
      this.people.push({ id, firstName, lastName, age, city });
    }
  }

  async getUniqueId() {
    let id;
    do {
      id = await question('ID: ');
      if (this.people.some(person => person.id === id)) {
        console.log('ID already exists. Please enter a unique ID.');
      }
    } while (this.people.some(person => person.id === id));
    return id;
  }

  async getValidAge() {
    let age;
    do {
      const input = await question('Age: ');
      age = parseInt(input, 10);
      if (isNaN(age)) console.log('Please enter a valid number for age.');
    } while (isNaN(age));
    return age;
  }

  displayPerson(person) {
    const fullName = `${person.firstName} ${person.lastName}`;
    console.log(`
ID: ${person.id}
Full Name: ${fullName}
Age: ${person.age}
City: ${person.city}
    `);
  }

  viewAll() {
    if (this.people.length === 0) {
      console.log('No people to display.');
      return;
    }
    console.log('\n=== All People ===');
    this.people.forEach(person => this.displayPerson(person));
  }

  async viewById() {
    const id = await question('Enter ID to view: ');
    const person = this.people.find(p => p.id === id);
    person ? this.displayPerson(person) : console.log('Person not found.');
  }

  deleteAll() {
    this.people = [];
    console.log('All people deleted.');
  }

  async deleteById() {
    const id = await question('Enter ID to delete: ');
    const initialLength = this.people.length;
    this.people = this.people.filter(p => p.id !== id);
    console.log(initialLength === this.people.length ? 'Person not found.' : 'Person deleted.');
  }
}

async function main() {
  const manager = new PersonManager();
  
  console.log('=== Enter Data for 10 People ===');
  await manager.collectPeople(10); 
  
  while (true) {
    console.log(`
=== Main Menu ===

1. View all people
2. View person by ID

3. Delete all people
4. Delete person by ID

5. Exit
    `);
    
    const choice = await question('Select option (1-5): ');
    
    switch (choice) {
      case '1':
        manager.viewAll();
        break;
      case '2':
        await manager.viewById();
        break;
      case '3':
        manager.deleteAll();
        break;
      case '4':
        await manager.deleteById();
        break;
      case '5':
        rl.close();
        return;
      default:
        console.log('Invalid choice. Please try again.');
    }
  }
}

main().catch(console.error);
