import { useState, useEffect } from "react";
import personService from "./services/personServices";
import axios from "axios";
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Notification from "./components/Notification";
import Error from "./components/Error";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const namesToShow =
    search === ""
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(search.toLowerCase())
        );

  const addName = (event) => {
    event.preventDefault();

    const exists = persons.some(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    );

    if (exists) {
      const changeNum = confirm(
        `${newName} is already added to phonebook, replace the old number with the new one?`
      );

      if (changeNum) {
        const name = persons.find((n) => n.name === newName);
        const changedName = { ...name, number: newNumber };

        personService
          .update(name.id, changedName)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== name.id ? person : returnedPerson
              )
            );
            setNewName("");
            setNewNumber("");
            setNotification(`Updated ${returnedPerson.name}'s number`);
            setTimeout(() => {
              setNotification(null);
            }, 3000);
          })
          .catch(() => {
            setError(
              `Information of ${name.name} has already been removed from server!`
            );
            setPersons(persons.filter((n) => n.id !== name.id));
            setNewName("");
            setNewNumber("");
            setTimeout(() => {
              setError(null);
            }, 5000);
          });
      }
    } else {
      const name = { name: newName, number: newNumber };

      personService.create(name).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
        setNotification(`Added ${returnedPerson.name}`);
        setTimeout(() => {
          setNotification(null);
        }, 3000);
      });
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleDelete = (id, name) => {
    const confirmDelete = confirm(`Delete ${name} ?`);
    if (confirmDelete) {
      personService
        .deletePerson(id)
        .then(() => {
          console.log(`Deleted person with id ${id}`);
          setPersons(persons.filter((n) => n.id !== id));
        })
        .catch((err) => {
          setError(
            `Information of ${name} has already been removed from server!`
          );
          setPersons(persons.filter((n) => n.id !== id));
          setTimeout(() => {
            setError(null);
          }, 5000);
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Error message={error} />
      <Notification message={notification} />
      <Filter search={search} onChange={handleSearch} />

      <h3>Add a New</h3>

      <PersonForm
        addName={addName}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons person={namesToShow} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
