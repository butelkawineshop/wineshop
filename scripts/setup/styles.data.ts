export interface StyleData {
  title: {
    sl: string
    en: string
  }
  description?: {
    sl: string
    en: string
  }
  iconKey: string
}

export const stylesData: StyleData[] = [
  // Belo / White
  {
    title: {
      sl: 'Belo',
      en: 'White',
    },
    description: {
      sl: 'Belo vino je preprosto. Potrgaš grozdje. Stisneš grozdje. Vzameš sokec. Narediš vino! Simpl, a ne? Pogosto imamo zmotno prepričanje, da so bela vina vedno sveža in lahka, a obstaja ogromno primerov belih vin, ki so kompleksna, bogata, kremasta in se nekatere celo fantastično starajo.',
      en: 'White wines are simple. You pick the grapes. You press the grapes. You take the juice. You make the Juice! Common misconception about white wines is they are always light, but there are many many whites that are rich, complex, creamy and can even age beautifully',
    },
    iconKey: 'white',
  },
  // Rdeče / Red
  {
    title: {
      sl: 'Rdeče',
      en: 'Red',
    },
    description: {
      sl: 'Rdeča vina pridejo iz rdečega grozdja. Začuda a ne? Ampak veliko ljudi se ne zaveda, da sok je dejansko prozoren. Tako da se iz rdečega grozdja, da narediti belo vino, če bi si to želeli. En takšen znan primer so recimo Šampanjci. Barva dejansko pride iz maceracije - namakanja rdečih kožic v soku, ki potem razmažejo svojo lepo barvo in razgradijo mogočne antioksidante - tanine, ki se skrivajo v kožicah.',
      en: 'Red wines come from red grapes. Surprisingly, no? Well, lots of people would be surprised to learn, the juice inside the grapes is actually clear, and the color comes from the skins. You need to macerate the skins in the juice for them to release their color and their beautiful antioxidants - tannins. But you can make white wine out of red grapes if you wanted. A famous example? Well, Champage of course!',
    },
    iconKey: 'red',
  },
  // Roza / Pink
  {
    title: {
      sl: 'Roza',
      en: 'Pink',
    },
    description: {
      sl: 'Roza vina oz rozejčki, so super vina, ki jih imamo najraje poleti. A v bistvu zelo lepo pašejo tudi s hrano, sploh kakšnimi lažjimi jedmi. Barva prihaja iz izjemno kratke maceracije (max 48 ur) ali pa direktno iz preše, kjer se nekaj malega barve sprosti ob pritisku. Kot zanimivo dejstvo, barva rozeja, vam ne bo povedala kako sladek je. Obstajajo izjemno nežni sladki rozeji, in izjemno temni suhi rozeji.',
      en: 'Pink wines or Rose wines if you want to be snobby, are mostly made of red grapes, but can have some white blended into them. The beautiful color comes from either a super short maceration (max 48 hrs) or just from the free run juice, coming directly of the press. Fun fact: color will NOT tell you the sweetness of the wine. You can have pale sweet rose, or super dark dry rose.',
    },
    iconKey: 'rose',
  },
  // Maceracije / Skin contact
  {
    title: {
      sl: 'Maceracije',
      en: 'Skin contact',
    },
    description: {
      sl: 'Maceracije ali pa oranžna vina so bela vina, ki jih delamo kot rdeča. Vse je torej v maceraciji na kožicah, ki pomaga izluščiti tanine, ti pa potem dodajo strukturo vinu. Kot zanimivost je pomembno vedeti, da je oranžna barva bolj znak oksidacije kot maceracije. In če misliš, da ti oranžna vina niso všeč, poskusi kakšno z manj oksidacije, pa te mogoče prepričajo.',
      en: 'Skin contact or Orange as they are often called wines are basically white wines, made as if they were red. The white grape skins stay in contact with the wine, and the maceration then extracts extra tannings and a bit more body to the wines. The color actually comes more from the oxidation then from the actual maceration. So if you had bad experience with orange wines, maybe ask for one with less oxidation and maybe you will come around.',
    },
    iconKey: 'skin-contact',
  },
  // Mehurčki / Bubbles
  {
    title: {
      sl: 'Mehurčki',
      en: 'Bubbles',
    },
    description: {
      sl: 'Obstaja več vrst mehurčkov, a tri glavne metode pridelave so klasična metoda (tista za šampanjce), Charmat metoda (za prosecco) in pa Pet-Nat. Vse imajo isti cilj – ujeti CO₂, ki nastane med fermentacijo, in ga pretvoriti v zabavne mehurčke, ampak do tega pridejo na malce različne načine. Pet-Nat je najbolj freestyle – vino gre v steklenico, še preden fermentacija sploh konča. Za Charmat metodo najprej naredijo normalno vino, nato pa ga zaprejo v ogromen tank, kjer se zgodi druga fermentacija. Ko je dovolj mehurčkov, ga pretočijo v steklenice. Klasična metoda pa je eleganten starejši brat. Tudi tu gre za drugo fermentacijo, ampak to se zgodi direktno v steklenici, kjer vino počiva, dozoreva in nabira kompleksnost. Več dela, več okusa.',
      en: 'There are a few different types of bubbles, but the three main ones would be the Traditional (Champagne) method, the Charmat (Prosecco) method and Pet-Nats. They all have the same goal. Keeping that Co2 that happens during fermentation to make their wines more fun, but they achieve it slightly differently. Pet Nat is basically a wine that was bottled before the fermentation was complete. Charmat method means that they start a secondary fermentation in a huge tank, after they have made a "normal" still wine already - then they just bottle it. Traditional method is similar to Charmat, but instead of the second fermentation  in the tank, they do it directly in the bottle. Complex, but delicious!',
    },
    iconKey: 'bubbles',
  },
  // Cukrčki / Sweeties
  {
    title: {
      sl: 'Cukrčki',
      en: 'Sweeties',
    },
    description: {
      sl: 'Cukrčki oziroma desertna vina so kriminalno premalo pita! Ok pustimo to, da so izjemno okusna, božansko kompleksna in da naredijo sladice še boljše. Desertna vina pomagajo sproščati dopamin! Če hočeš dobro spati povečerji, ali pa rabiš malce ekstra dobre volje tik pred spanjem (wink wink), ne pozabi naročit kozarčka sladkega vina ob večerji.',
      en: "Sweet wines — or dessert wines — are criminally underrated!\nLet's put aside the fact that they're incredibly delicious, divinely complex, and make desserts even better. Dessert wines actually help release dopamine! So if you want to sleep like a baby after dinner, or you need a little extra boost of good vibes before bed (wink wink), don't forget to order a glass of sweet wine with your meal.",
    },
    iconKey: 'sweet',
  },
  // Pošasti / Beasts
  {
    title: {
      sl: 'Pošasti',
      en: 'Beasts',
    },
    description: {
      sl: 'Ne, niso nobene fantastične zveri in jih tudi ni treba iskati v divjini. Govorimo o magnumih, jeroboamih, rehoboamih in vseh drugih velikanskih steklenicah, poimenovanih po starodavnih kraljih. Ampak ni fora samo v izgledu. Vina, ki zorijo v magnumih, so pogosto najboljša verzija samega sebe. Nekaj je na tistih idealnih proporcih – ravno prav vina, ravno prav zraka. Včasih pač velikost šteje!',
      en: "Ok they are not actually fantastic beasts and you don't have to look far to find them. We are talking about magnums and jeroboams and rehoboams and all the other ancient king names for insanely large bottles. But it's not just about the looks. Wines aged in magnums tend to be the best expression of the wine. Something about the perfect proportions basically. Size sometimes matters!",
    },
    iconKey: 'beasts',
  },
  // Malčki / Babies
  {
    title: {
      sl: 'Malčki',
      en: 'Babies',
    },
    description: {
      sl: 'Včasih je cela flaška maaaal preveč. Takrat pa prav pride kšna manjša butelkica. Majhno, a sladko.',
      en: 'Sometimes a whole bottle is too much. Then a smaller one comes in handy. Small, but sweet.',
    },
    iconKey: 'babies',
  },
]
