const Persons = (props) => {
  return (
    <table>
      <tbody>
        {props.person.map((person) => (
          <tr key={person.id}>
            <td key={person.name}>{person.name}</td>
            <td key={person.id}>{person.number}</td>
            <td>
              <button
                onClick={() => props.handleDelete(person.id, person.name)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Persons;
