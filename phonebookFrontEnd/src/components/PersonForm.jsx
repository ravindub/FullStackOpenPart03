const PersonForm = (props) => {
  return (
    <form onSubmit={props.addName}>
      <div>
        Name:{" "}
        <input
          value={props.newName}
          onChange={props.handleNameChange}
          required
        />
      </div>
      <div>
        Number:{" "}
        <input
          value={props.newNumber}
          onChange={props.handleNumberChange}
          type="number"
          required
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
