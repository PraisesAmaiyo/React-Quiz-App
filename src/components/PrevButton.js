function PrevButton({ dispatch, index = null }) {
  if (index === 0) return <span></span>;

  return (
    <button className="btn " onClick={() => dispatch({ type: 'prevQuestion' })}>
      Previous
    </button>
  );
}

export default PrevButton;
