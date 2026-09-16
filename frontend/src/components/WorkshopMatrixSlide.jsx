export default function WorkshopMatrixSlide({ rows = [] }) {
  return (
    <div className="workshop-slide workshop-matrix-slide">
      <div className="matrix-table-wrap">
        <table className="matrix-table">
          <thead>
            <tr>
              <th scope="col">Scenario</th>
              <th scope="col">Recommended stack</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.scenario}>
                <td className="matrix-scenario">{row.scenario}</td>
                <td className="matrix-stack">{row.stack}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
