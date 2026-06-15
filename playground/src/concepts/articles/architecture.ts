import type { ConceptArticle } from "../types";

/**
 * The flagship Foundations article: the architecture of Japanese for someone who
 * thinks in systems, in ~1 hour. Defines every piece of jargon (体言/用言/助詞/
 * 活用/コピュラ) inline and indexes into the Course chapters.
 */
const article: ConceptArticle = {
  id: "architecture",
  order: 1,
  icon: "🏛️",
  titleEn: "Japanese in One Hour: the Architecture",
  titleZh: "一小时读懂日语的架构",
  taglineEn:
    "Not greetings — the design principles of the language, for people who think in systems.",
  taglineZh: "不是寒暄用语，而是这门语言的设计原理 —— 写给习惯用系统思维的人。",
  readEn: "~1 hour",
  readZh: "约 1 小时",
  introEn:
    "You have one hour. Spend it on architecture, not on `こんにちは`. Most courses hand you phrases and hope the grammar assembles itself later; we'll do the opposite — install the seven load-bearing ideas first, so every phrase you meet afterwards snaps onto a frame you already understand.\n\nHere is the headline a programmer can hold onto: **Japanese is regular where English is irregular, and explicit where English is positional.** Grammatical roles are tagged, not guessed from word order; predicates are built by gluing endings onto stems with a near-total function; politeness and tense are dimensions of that function, not extra vocabulary. That regularity is exactly why this whole site can model sentences as *types* a compiler checks. Seven principles follow. Take them in order.",
  introZh:
    "你有一个小时。把它花在架构上，而不是 `こんにちは`。多数教程先塞给你一堆短语，指望语法日后自己拼起来；我们反过来 —— 先装好七根承重梁，往后你遇到的每个短语都能扣进一个你已经理解的框架。\n\n给程序员一句能攥住的总纲：**在英语凭语序、靠记忆的地方，日语是显式而规则的。** 语法角色是被「标注」出来的，而不是从词序里猜的；谓语是把词尾「粘」到词干上、用一个近乎全函数的规则造出来的；礼貌和时态是这个函数的维度，而不是另一套词汇。正是这种规则性，才让整个网站能把句子建模成编译器可校验的「类型」。下面七条原理，请按顺序读。",
  sections: [
    {
      id: "agglutinative",
      headingEn: "Meaning is built by gluing suffixes onto stems",
      headingZh: "意义是把后缀「粘」到词干上造出来的",
      blocks: [
        {
          kind: "prose",
          en: "Start with the single fact that explains the most. Japanese is an **agglutinative** language: you take a root and stick small, regular pieces onto its end, one after another, each adding one unit of meaning. English mostly uses separate words and word order (*I did not eat*); Japanese grows one word longer (`食べ` → `食べない` → `食べなかった`).\n\nMentally, picture a builder pattern or a Unix pipe: a stem flows through a chain of suffixes, and each suffix is a small, composable transform. The pieces rarely fuse or mutate the way English *go → went* does. That regularity is the whole reason the grammar is *typeable* — and why the rest of this site can compute a sentence's surface form from its parts.",
          zh: "先记住这条解释力最强的事实。日语是一门 **黏着语（agglutinative）**：你拿一个词根，把一个个小而规则的零件粘到它末尾，每个零件添一份意义。英语多用独立的词加语序（*I did not eat*）；日语则是把一个词越接越长（`食べ` → `食べない` → `食べなかった`）。\n\n在脑子里把它想成 builder 模式或 Unix 管道：一个词干流经一串后缀，每个后缀都是一个小而可组合的变换。这些零件很少像英语 *go → went* 那样融合、突变。正是这种规则性，让语法变得「可类型化」—— 也正因如此，本站才能从一个句子的各部分算出它的最终表面形式。",
        },
        {
          kind: "define",
          term: "膠着語",
          reading: "こうちゃくご",
          romaji: "kōchakugo",
          en: "Agglutinative language — one that builds words by chaining separable, single-purpose suffixes onto a stem. Japanese, Korean and Turkish are the textbook cases.",
          zh: "黏着语 —— 通过把可分离、各司其职的后缀链接到词干上来构词的语言。日语、韩语、土耳其语是典型代表。",
        },
      ],
    },
    {
      id: "sov",
      headingEn: "The predicate comes last — always",
      headingZh: "谓语永远在最后",
      blocks: [
        {
          kind: "prose",
          en: "Japanese is **SOV**: Subject – Object – *Verb*. The word that does the asserting — the verb, adjective, or *noun + copula* — sits at the very end of the clause. English is SVO (*I eat sushi*); Japanese is \"I sushi eat.\"\n\nThink of the predicate as the operator and everything before it as its operands: the sentence accumulates arguments and only *applies* them at the final word. This is why a Japanese sentence can feel suspenseful — you don't learn whether it's a question, a negation, or a past tense until the end, because all of that lives in the tail. Rule of thumb: **read to the last word before you decide what the sentence means.**",
          zh: "日语是 **SOV** 语序：主语 – 宾语 – *动词*。负责「下断言」的那个词 —— 动词、形容词，或 *名词＋系动词* —— 坐在小句的最末尾。英语是 SVO（*I eat sushi*）；日语则是「我 寿司 吃」。\n\n把谓语看作运算符，它前面的一切都是操作数：句子一路累积参数，直到最后一个词才真正「求值」。这也是日语句子常带悬念的原因 —— 它到底是疑问、否定还是过去时，你要读到末尾才知道，因为这些信息全都住在词尾里。经验法则：**读到最后一个词，再决定整句的意思。**",
        },
        {
          kind: "example",
          jp: "私は寿司を食べる",
          reading: "わたしはすしをたべる",
          en: "I eat sushi. (literally: I / sushi / eat)",
          zh: "我吃寿司。（字面：我 / 寿司 / 吃）",
        },
        { kind: "chapters", ids: ["e01", "e05"] },
      ],
    },
    {
      id: "particles",
      headingEn: "Particles are postfix role-tags, so word order is free",
      headingZh: "助词是后置的「角色标签」，所以词序是自由的",
      blocks: [
        {
          kind: "prose",
          en: "This is the keystone. After each noun comes a tiny **particle** that declares the noun's grammatical role: `は` marks the topic, `が` the subject, `を` the object, `に` the destination, `で` the location/means, `へ` the direction. The role travels *with* the noun as a suffix — it is not inferred from position.\n\nThe programmer's analogy is exact: particles are **named arguments**. English is positional — `f(a, b)` means something different from `f(b, a)`. Japanese is keyword-based — `食べる(topic=私, object=寿司)` means the same thing however you shuffle the middle. That's why the only rigid rule is *predicate-last* (Principle 2): once roles are tagged, their order stops mattering. Master the particle set and you've learned Japanese sentence structure; the rest is vocabulary and endings.",
          zh: "这是拱心石。每个名词后面跟一个小小的 **助词**，用来声明该名词的语法角色：`は` 标记主题，`が` 标记主语，`を` 标记宾语，`に` 标记目的地，`で` 标记地点/方式，`へ` 标记方向。角色作为后缀「随名词一起走」—— 它不是从位置推断出来的。\n\n程序员的类比恰如其分：助词就是 **具名参数（named arguments）**。英语是位置式的 —— `f(a, b)` 和 `f(b, a)` 含义不同。日语是关键字式的 —— `食べる(topic=私, object=寿司)`，你怎么打乱中间都还是同一个意思。这正是为什么唯一刚性的规则是「谓语在最后」（原理 2）：角色一旦被标注，它们的先后就不再重要。把这套助词吃透，你就掌握了日语的句子结构；剩下的只是词汇和词尾。",
        },
        {
          kind: "define",
          term: "助詞",
          reading: "じょし",
          romaji: "joshi",
          en: "Particle — an uninflected grammatical marker placed *after* a word to assign its role (は が を に で …) or to glue clauses together. The closest English analogue is a preposition, but particles come after, not before, and never change shape.",
          zh: "助词 —— 放在词语*之后*、用来指派其角色（は が を に で …）或连接小句的语法标记，本身不活用（不变形）。最接近的英语类比是介词，但助词后置而非前置，且永不变形。",
        },
        {
          kind: "example",
          jp: "寿司を私は食べる",
          reading: "すしをわたしはたべる",
          en: "I eat sushi. — object first this time, identical meaning: the `を` and `は` tags carry the roles, not the order.",
          zh: "我吃寿司。—— 这次宾语在前，意思完全一样：是 `を`、`は` 这两个标签扛着角色，而不是词序。",
        },
        { kind: "chapters", ids: ["e01", "e05", "e06"] },
      ],
    },
    {
      id: "wa-ga",
      headingEn: "は vs が — topic versus subject (the famous trap)",
      headingZh: "は 与 が —— 主题与主语之分（著名的坑）",
      blocks: [
        {
          kind: "prose",
          en: "Two particles both translate to the English subject \"I\", and telling them apart is the first real puzzle every learner hits. They do different jobs.\n\n**`は` sets the topic** — \"as for X, ...\". It lifts something out as the frame the rest of the sentence comments on, and it often carries old/known information. **`が` marks the grammatical subject** — the specific doer, and often *new* information, the answer to \"who/what?\". `私は学生です` says \"speaking of me, [I'm] a student\" (topic). `誰が来た？ — 田中さんが来た` answers \"who came?\" with `が`, spotlighting the new subject. A useful first heuristic: **`は` frames, `が` identifies.** You will refine this for years, but that one sentence will carry you a long way.",
          zh: "有两个助词都对应英语里作主语的「I」，分清它们是每个学习者撞上的第一道真正难题。它们干的是不同的活。\n\n**`は` 设定主题** —— 「说到 X，……」。它把某物拎出来当作框架，让句子其余部分对它作评述，且常承载旧的/已知的信息。**`が` 标记语法主语** —— 那个具体的施事者，常是*新*信息，是「谁/什么？」的答案。`私は学生です` 说的是「说到我，[我]是学生」（主题）；`誰が来た？ — 田中さんが来た` 用 `が` 回答「谁来了？」，把新主语打上聚光灯。一个好用的初步判据：**`は` 搭框架，`が` 作指认。** 这条你会打磨很多年，但单凭这一句就能带你走很远。",
        },
        { kind: "chapters", ids: ["e01"] },
      ],
    },
    {
      id: "three-predicates",
      headingEn: "Three kinds of predicate — and only two of them conjugate",
      headingZh: "谓语只有三种 —— 而且只有两种会活用",
      blocks: [
        {
          kind: "prose",
          en: "Every Japanese clause ends in a predicate, and there are exactly three kinds. Japanese grammar sorts words into two camps by one test — *does the word change shape on its own?* — and that test draws the line between the predicates that carry their own tense/politeness and the one that has to borrow.",
          zh: "每个日语小句都以谓语收尾，而谓语恰好只有三种。日语语法用一个测试把词分成两大阵营 —— *这个词自己会不会变形？* —— 这个测试划出了那条界线：哪些谓语自带时态/礼貌，哪个必须去借。",
        },
        {
          kind: "define",
          term: "用言",
          reading: "ようげん",
          romaji: "yōgen",
          en: "Inflecting words — words that are predicates on their own and change shape (conjugate): verbs (動詞) and adjectives (形容詞). A 用言 can end a sentence by itself: 食べる (eat), 高い (is expensive).",
          zh: "用言 —— 自身就能充当谓语、并且会变形（活用）的词：动词（動詞）和形容词（形容詞）。一个用言能独立结句：食べる（吃）、高い（贵）。",
        },
        {
          kind: "define",
          term: "体言",
          reading: "たいげん",
          romaji: "taigen",
          en: "Non-inflecting words — nouns. A 体言 never changes shape and cannot end a statement by itself; to assert \"X is …\" it must borrow the copula (だ/です). 学生 (student) is a 体言; to predicate it you say 学生だ / 学生です.",
          zh: "体言 —— 不变形的词，即名词。体言永不变形，也不能独立结句；要表达「X 是……」，它必须借用系动词（だ/です）。学生 是体言；要让它作谓语，得说 学生だ / 学生です。",
        },
        {
          kind: "prose",
          en: "So the three predicates are:\n\n**1. Verb (動詞, a 用言)** — an action: `食べる` *eat*, `行く* *go*. Conjugates on its own.\n**2. Adjective (形容詞, a 用言)** — a property, in two flavors: *i-adjectives* (`高い` expensive) which conjugate like verbs, and *na-adjectives* (`静か` quiet) which are really noun-like roots that lean on the copula. \n**3. Noun + copula (体言 + コピュラ)** — `学生だ` *is a student*. The noun supplies the meaning; the copula `だ`/`です` supplies the \"…is\" and does the inflecting.\n\nA type-theory reader can read this as a **sum type**: `Predicate = Verb | Adjective | (Noun × Copula)`. Two of the three inflect themselves; the third delegates inflection to the copula. That is the single most clarifying picture of Japanese grammar — and the exact shape this site's type library models.",
          zh: "于是三种谓语是：\n\n**1. 动词（動詞，用言）** —— 一个动作：`食べる` *吃*、`行く` *去*。自身就会活用。\n**2. 形容词（形容詞，用言）** —— 一种性质，分两种风味：*い形容词*（`高い` 贵）像动词一样活用，以及 *な形容词*（`静か` 安静），它们本质上是接近名词的词根，要靠系动词。\n**3. 名词＋系动词（体言＋コピュラ）** —— `学生だ` *是学生*。名词提供意义，系动词 `だ`/`です` 提供「……是」并负责变形。\n\n懂类型论的读者可以把它读成一个 **和类型（sum type）**：`Predicate = Verb | Adjective | (Noun × Copula)`。三者里有两个自己活用，第三个把活用委托给系动词。这是关于日语语法最具廓清力的一张图 —— 也正是本站类型库所建模的形状。",
        },
        {
          kind: "define",
          term: "コピュラ",
          romaji: "copula",
          en: "Copula — the linking word だ (plain) / です (polite) that turns a noun into a \"X is Y\" statement. It is not a particle: it inflects (だ → だった → ではない …), so it behaves like a tiny third predicate-engine alongside verbs and adjectives.",
          zh: "系动词（コピュラ）—— 把名词变成「X 是 Y」陈述的连系词 だ（简体）/ です（礼貌）。它不是助词：它会活用（だ → だった → ではない …），所以它像第三台微型「谓语引擎」，与动词、形容词并列。",
        },
        { kind: "chapters", ids: ["e05", "e08", "e01", "e13"] },
      ],
    },
    {
      id: "conjugation",
      headingEn: "Conjugation is a pure function: (word, form) → string",
      headingZh: "活用是一个纯函数：(词, 形) → 字符串",
      blocks: [
        {
          kind: "prose",
          en: "Here is where the architecture pays off. A 用言 (or the copula) doesn't get *new words* for past, negative, polite, or \"let's…\". It transforms its **tail** into one of a small, fixed set of **forms** (活用形). Given the word and the form name, the surface string is determined — deterministic, finite, no agreement with the subject. It is, almost literally, a pure function.\n\nThis is the thesis of *Typed Japanese*: if conjugation is a total function, you can encode it in a type system and let the compiler compute (and check) the result. `ConjugateVerb<食べる, \"て形\">` evaluates to the string `\"食べて\"`. Negation, tense and politeness are just different `form` arguments to the same function — you are not memorizing irregular forms, you are calling a method.",
          zh: "架构的回报在这里兑现。一个用言（或系动词）并不会为过去、否定、礼貌、「我们来……吧」换上*新词*。它把自己的 **词尾** 变换成一组小而固定的 **活用形** 之一。给定词与活用形名，表面字符串就被确定下来 —— 确定、有限、不与主语作一致变化。它几乎就是字面意义上的纯函数。\n\n这正是 *Typed Japanese* 的核心命题：如果活用是一个全函数，你就能把它编码进类型系统，让编译器去算（并校验）结果。`ConjugateVerb<食べる, \"て形\">` 求值为字符串 `\"食べて\"`。否定、时态、礼貌只是同一个函数的不同 `form` 参数 —— 你不是在背不规则变化，你是在调用一个方法。",
        },
        {
          kind: "define",
          term: "活用",
          reading: "かつよう",
          romaji: "katsuyō",
          en: "Conjugation / inflection — the systematic reshaping of a 用言's or the copula's ending to express tense, polarity, politeness, mood, or connection. Each target is a named 活用形 (form), e.g. て形, ない形, ます形.",
          zh: "活用 —— 对用言或系动词词尾进行系统性变形，以表达时态、肯否、礼貌、语气或连接。每个目标都是一个有名字的 *活用形*，如 て形、ない形、ます形。",
        },
        {
          kind: "example",
          jp: "食べる → 食べない → 食べた → 食べて",
          reading: "たべる → たべない → たべた → たべて",
          en: "eat → not eat → ate → eating/and(connective). One stem, four forms — same function, different `form` argument.",
          zh: "吃 → 不吃 → 吃了 → 吃（て形/连接）。同一个词干，四个形 —— 同一个函数，不同的 `form` 参数。",
        },
        { kind: "chapters", ids: ["e05", "e08", "e13"] },
      ],
    },
    {
      id: "politeness",
      headingEn: "Politeness is a grammatical axis, not a word choice",
      headingZh: "礼貌是语法的一根轴，不是选词",
      blocks: [
        {
          kind: "prose",
          en: "In English, politeness is mostly word choice and hedging (*gimme* vs *could I have*). In Japanese it is **built into the grammar**: the very same proposition exists at different politeness levels, and you move between them by changing the predicate's ending, not by swapping vocabulary. `食べる` (plain) and `食べます` (polite) are the same verb, same meaning, different register; `学生だ` and `学生です` likewise. Above that sits 敬語 (honorific/humble speech), a whole further layer for status and deference.\n\nThe practical consequence: **register is a dimension you set, like a flag**, and it lives in the tail you already control via conjugation (Principle 6). You will choose plain or polite for *every* sentence — there is no neutral default — so it pays to feel, early, that the ending is doing social work as well as grammatical work.",
          zh: "在英语里，礼貌多半是选词和措辞的软化（*gimme* 对 *could I have*）。在日语里，它是 **嵌进语法里的**：同一个命题存在于不同的礼貌层级，你在它们之间切换靠的是改谓语词尾，而不是换词汇。`食べる`（简体）与 `食べます`（礼貌）是同一个动词、同一个意思、不同的语体；`学生だ` 与 `学生です` 也一样。再往上还有 敬語（尊敬语/谦让语），那是为身份与敬意准备的又一整层。\n\n实际后果是：**语体是你要设定的一个维度，像一个开关标志**，而它就住在你已经能通过活用（原理 6）掌控的词尾里。你会为*每一*句话选择简体或礼貌 —— 没有中性的默认值 —— 所以越早体会到「词尾既在干语法的活、也在干社交的活」，越划算。",
        },
        { kind: "chapters", ids: ["e13", "i04", "i05"] },
      ],
    },
    {
      id: "next",
      headingEn: "Where to go from here",
      headingZh: "接下来去哪儿",
      numbered: false,
      blocks: [
        {
          kind: "prose",
          en: "That's the frame. With the seven principles in hand, the Grammar Course stops looking like a list of disconnected patterns and starts looking like an API: nouns get tagged with particles (Principle 3), the clause ends in one of three predicates (Principle 5), and you dial in tense and politeness by conjugating the tail (Principles 6–7).\n\nA sensible first path through the Course: start with the **noun + copula** sentence (`です`/`だ`), then **verbs** and the `を` object, then the everyday **particles**, then **adjectives**, then the **plain (普通) forms** that unlock casual speech and most advanced grammar. Open any sentence in the **Playground** to watch its type resolve, piece by piece, to the Japanese you just read.",
          zh: "框架就是这些。手握这七条原理，语法教程不再像一串互不相干的句型，而开始像一套 API：名词用助词打标签（原理 3），小句以三种谓语之一收尾（原理 5），你通过给词尾活用来拨入时态与礼貌（原理 6–7）。\n\n一条合理的入门路线：先学 **名词＋系动词** 句（`です`/`だ`），再学 **动词** 与 `を` 宾语，接着是日常 **助词**，然后是 **形容词**，最后是解锁口语与大部分高级语法的 **简体（普通）形**。在 **演练场** 里打开任意句子，看它的类型如何一块一块地求值成你刚读到的那句日语。",
        },
        { kind: "chapters", ids: ["e01", "e05", "e06", "e08", "e13"] },
      ],
    },
  ],
};

export default article;
