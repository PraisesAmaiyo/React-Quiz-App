function PrevButton({ dispatch, index = null }) {
  if ((index = 0)) return <span></span>;

  return (
    <div>
      <div>
        <button
          className="btn "
          onClick={() => dispatch({ type: 'prevQuestion' })}
        >
          Previous
        </button>
      </div>
    </div>
  );
}

export default PrevButton;
