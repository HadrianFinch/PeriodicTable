const Search = {
    Search: null
};

(() => {
    function similarity(s1, s2)
    {
        s1.toLowerCase();
        s2.toLowerCase();

        var longer = s1;
        var shorter = s2;
        if (s1.length < s2.length) {
            longer = s2;
            shorter = s1;
        }
        var longerLength = longer.length;
        if (longerLength == 0) {
            return 1.0;
        }
        return (longerLength - EditDistance(longer, shorter)) / parseFloat(longerLength);
    }

    function EditDistance(s1, s2)
    {
        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();

        var costs = new Array();
        for (var i = 0; i <= s1.length; i++)
        {
            var lastValue = i;
            for (var j = 0; j <= s2.length; j++)
            {
                if (i == 0)
                    costs[j] = j;
                else
                {
                    if (j > 0)
                    {
                        var newValue = costs[j - 1];
                        if (s1.charAt(i - 1) != s2.charAt(j - 1))
                            newValue = Math.min(Math.min(newValue, lastValue),
                                costs[j]) + 1;
                        costs[j - 1] = lastValue;
                        lastValue = newValue;
                    }
                }
            }
            if (i > 0)
            {
                costs[s2.length] = lastValue;
            }
        }
        return costs[s2.length];
    }

    function CalculateWeight(base, q, itemName, itemSymbol)
    {
        var weight = 0;
        
        if ((q.length > 2) && (q != "uue"))
        {
            const sim = similarity(itemName, q);
            
            weight = base + sim;
            
            const words = itemName.toLowerCase().split(" ");
            const lc = q.toLowerCase();
            
            for (let a = 0; a < words.length; a++)
            {
                const word = words[a];
                if (lc.includes(word))
                {
                    weight += 1.5;
                }
            }
        }
        else
        {
            const sim = similarity(itemSymbol, q);
            // const sim = 0;
            weight = base + sim;

            const lc = q.toLowerCase();
    
            if (itemSymbol.toLowerCase() == q.toLowerCase())
            {
                weight += 100.5;
            }

        }
        
        return weight;
    }

    Search.Search = (inputLibrary, querry) =>
    {
        const s = querry.q;
        const lib = [];

        for (let i = 0; i < inputLibrary.length; i++)
        {
            const item = inputLibrary[i];

            const weight = CalculateWeight(item.weight, s, item.name, item.data.symbol);

            lib.push({
                type: item.type,
                name: item.name,
                data: item.data,
                url: item.url,
                weight: weight
            });
        }

        lib.sort((a, b) => b.weight - a.weight)

        return lib;
    }
        
})();