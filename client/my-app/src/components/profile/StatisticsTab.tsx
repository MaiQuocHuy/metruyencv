const StatisticsTab = () => {
  return (
    <>
      <h3 className="mb-6 text-xl font-semibold">Your Reading Statistics</h3>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="bg-accent rounded-lg p-4 text-center">
          <h4 className="text-muted-foreground mb-2">Manga Read</h4>
          <p className="text-manga-500 text-4xl font-bold">42</p>
        </div>

        <div className="bg-accent rounded-lg p-4 text-center">
          <h4 className="text-muted-foreground mb-2">Chapters Read</h4>
          <p className="text-manga-500 text-4xl font-bold">873</p>
        </div>

        <div className="bg-accent rounded-lg p-4 text-center">
          <h4 className="text-muted-foreground mb-2">Reading Time</h4>
          <p className="text-manga-500 text-4xl font-bold">164h</p>
        </div>
      </div>

      <div className="mt-8">
        <h4 className="mb-4 font-medium">Top Genres</h4>
        <div className="space-y-3">
          {['Action', 'Fantasy', 'Romance', 'Adventure'].map((genre, index) => (
            <div key={genre} className="flex items-center">
              <div className="w-24 text-sm">{genre}</div>
              <div className="bg-accent h-4 flex-1 overflow-hidden rounded-full">
                <div
                  className="bg-manga-600 h-full"
                  style={{ width: `${100 - index * 15}%` }}
                ></div>
              </div>
              <div className="w-12 text-right text-sm">{100 - index * 15}%</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default StatisticsTab;
