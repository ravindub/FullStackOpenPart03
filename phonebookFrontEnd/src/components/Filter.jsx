const Filter = (props) => {
  return (
    <div>
      Filter shown with:
      <input value={props.search} onChange={props.onChange} />
    </div>
  );
};

export default Filter;
