-- Moves the "Faith in Christ" journey out of content-as-code
-- (content/en/faith-in-christ/*.json) into the journeys/journey_days tables,
-- so it's authored and edited in admin like every other journey. Same slug,
-- so existing journey_progress/session_completions rows keep working.
-- created_at is backdated to sort before every other journey, keeping it the
-- first journey listed on Home. Idempotent: skips if the slug already exists.

insert into journeys (slug, title, purpose, teaser, duration_days, completion_title, status, created_at)
select $fic$faith-in-christ$fic$, $fic$Faith in Christ$fic$, $fic$To help a person understand who Jesus is, what He has accomplished, what it means to place faith in Him, and what it means to begin following Him.$fic$, $fic$Discover who Jesus is, what He's done for you, and what it means to follow Him.$fic$, 7, $fic$You've taken your first Leap.$fic$, 'published',
       (select coalesce(min(created_at), now()) - interval '1 day' from journeys)
where not exists (select 1 from journeys where slug = 'faith-in-christ');

insert into journey_days (journey_id, day_number, title, scripture_reference, message, explore, reflect, pray, next_topic)
select j.id, d.day_number, d.title, d.scripture_reference, d.message, d.explore, d.reflect, d.pray, d.next_topic
from journeys j
cross join (values
  (1, $fic$Why Jesus?$fic$, $fic$John 1:14$fic$,
   $fic$John doesn't begin his account of Jesus with a manger. He begins with eternity: "In the beginning was the Word, and the Word was with God, and the Word was God." Then, a few verses later, comes the most astonishing sentence in history: "The Word became flesh and made His dwelling among us."

Jesus is not simply a good teacher, a prophet, or an inspiring example who appeared in history. He is the eternal Son of God who stepped into history. The One through whom all things were made took on flesh, walked dusty roads, ate with ordinary people, and showed us exactly what God is like, "full of grace and truth."

This is where faith begins: not with what we do for God, but with who Jesus is and the fact that He came near on purpose. Whatever you have believed about Him before today, and however far from God you may feel, start here. God did not wait for you to find your way up to Him. He came down to you.

Throughout Scripture, God longs to dwell with His people: in the garden, in the tabernacle, in the temple. In Jesus, that longing takes on a human face. Colossians calls Him "the image of the invisible God." If you want to know what God is like, look at Jesus.$fic$,
   $fic$Read John 1:1-14 slowly, twice. What does John tell you about who Jesus is, and about how far God was willing to come to reach you?$fic$,
   $fic$What have I believed about Jesus until now? Who is Jesus to me today?$fic$,
   $fic$Jesus, thank You that You did not stay far away but came near to me. Open my eyes to see You as You truly are, and give me an open heart as I discover who You are. In Jesus' name, Amen.$fic$, null::text),
  (2, $fic$The Gospel$fic$, $fic$Romans 3:23-24$fic$,
   $fic$The word "gospel" means good news. But Paul begins with the bad news, because we can't value the good news until we see why we need it: "All have sinned and fall short of the glory of God." All of us. The religious and the irreligious, the respectable and the broken. None of us has lived the life we were made for.

Then comes the turn: we "are justified freely by His grace through the redemption that is in Christ Jesus." Justified means declared right with God. Freely means as a gift. Grace means we receive what we could never earn. Paul puts it even more plainly in Romans 5: "While we were still sinners, Christ died for us." Not after we cleaned ourselves up. While we were still far off.

Many of us carry a quiet belief that God will accept us once we become good enough. The gospel turns that upside down. Christ has already done what we could not do. Our part is not to earn the gift, but to receive it.

From the very beginning, Jesus announced this news: "The time is fulfilled, and the kingdom of God is near. Repent and believe in the gospel." The whole story of Scripture leads here: God making a way back to Himself for people who could never make the way themselves.$fic$,
   $fic$Read the passage slowly, twice. Notice the word "all" in verse 23 and the word "freely" in verse 24. What do these two words tell you about yourself and about God?$fic$,
   $fic$Where have I been trying to earn what God offers me as a gift?$fic$,
   $fic$Father, I confess that I have fallen short of Your glory. Thank You that in Christ You offer me grace I could never earn. Help me stop striving and simply receive what You have freely given. In Jesus' name, Amen.$fic$, null::text),
  (3, $fic$The Cross$fic$, $fic$Isaiah 53:5-6$fic$,
   $fic$Seven hundred years before Jesus was born, Isaiah described a suffering servant: "He was pierced for our transgressions, He was crushed for our iniquities; the punishment that brought us peace was upon Him." At first glance the cross looks like defeat. Isaiah shows us what was really happening there.

Notice the exchange. Our transgressions; His wounds. Our iniquities; His punishment. His wounds; our healing. "We all like sheep have gone astray... and the LORD has laid upon Him the iniquity of us all." Everything that separated you from God was placed on Jesus instead of on you.

The cross shows us two things at once. It shows how serious sin is: it cost the life of God's Son. And it shows how great God's love is: He was willing to pay that price. At the cross, God's justice and God's mercy meet. Sin is dealt with fully, and you are loved fully. Nothing you have done is beyond what He has already carried.

The New Testament writers saw Jesus in Isaiah's words. Peter wrote, "He Himself bore our sins in His body on the tree... By His stripes you are healed." And Jesus said He came "not to be served, but to serve, and to give His life as a ransom for many."$fic$,
   $fic$Read the passage slowly, twice. Underline every "He" and every "we" or "our." What did Jesus take, and what did He give you in return?$fic$,
   $fic$What does the cross reveal to me about God's love? What does it reveal about the seriousness of sin?$fic$,
   $fic$Jesus, thank You for carrying what I could never carry. Help me understand the depth of Your love and all that You accomplished for me on the cross. Let me live today as one who has been forgiven and set free. In Jesus' name, Amen.$fic$, null::text),
  (4, $fic$New Life$fic$, $fic$Romans 6:4$fic$,
   $fic$The story of Jesus does not end at the cross. On the third day, the women came to the tomb and found it empty. The angels asked, "Why do you look for the living among the dead? He is not here; He has risen!" Death could not hold Him.

Paul tells us the resurrection is not only something that happened to Jesus. It is the pattern for everyone who belongs to Him: "just as Christ was raised from the dead through the glory of the Father, we too may walk in newness of life." When you put your faith in Christ, you are joined to Him: to His death, so that the old life loses its grip; and to His resurrection, so that a new life begins.

This means your past does not get the final word. The old patterns, the failures, the labels others have put on you: none of them define who you are in Christ. That doesn't mean everything changes overnight. It means you now walk in a new direction, one step at a time, with the risen Jesus walking with you.

Across Scripture, God is the One who brings life where there was none: from dust in Genesis, to dry bones in Ezekiel, to an empty tomb in Jerusalem. As Paul wrote, "If anyone is in Christ, he is a new creation. The old has passed away. Behold, the new has come!"$fic$,
   $fic$Read the passage slowly, twice. What does Paul connect our new life to? What does the phrase "walk in newness of life" suggest about how new life is lived out day by day?$fic$,
   $fic$What would "new life" look like in my circumstances today?$fic$,
   $fic$Lord Jesus, thank You that You are alive and that in You I can walk in newness of life. Where I am still held by old patterns, set me free. Teach me to live each day in the reality of the new life You have given me. In Jesus' name, Amen.$fic$, null::text),
  (5, $fic$Faith$fic$, $fic$John 1:12$fic$,
   $fic$How does a person come into this new life? John answers simply: "to all who did receive Him, to those who believed in His name, He gave the right to become children of God." Receive. Believe. Not achieve, not earn, not perform.

Faith is not a feeling you have to work up, and it is not a leap into the dark. It is trust placed in Someone who is trustworthy. Think of sitting down on a chair: you don't need to understand how it was made before you rest your weight on it. Faith is resting the weight of your life on Jesus: on who He is and what He has done.

You don't need to have everything figured out to begin. One father in the Gospels cried out to Jesus, "I do believe; help my unbelief!" and Jesus did not turn him away. Faith that is small but placed in Jesus is enough to begin. And faith grows the more you lean on Him, not the more you analyze it.

Scripture describes faith as both a moment and a way of life. Paul writes, "if you confess with your mouth, 'Jesus is Lord,' and believe in your heart that God raised Him from the dead, you will be saved." And he describes the ongoing life of faith: "I live by faith in the Son of God, who loved me and gave Himself up for me."$fic$,
   $fic$Read the passage slowly, twice. What does John say a person must do, and what does God give in return? What does it mean to you to be called a child of God?$fic$,
   $fic$What makes it difficult for me to trust God? What would it look like to rest my weight on Jesus today?$fic$,
   $fic$Jesus, I believe; help my unbelief. I receive You today, not because I have everything figured out, but because You are trustworthy. Teach me to trust You with my whole life. In Jesus' name, Amen.$fic$, null::text),
  (6, $fic$Following Jesus$fic$, $fic$Luke 9:23$fic$,
   $fic$Jesus never asked for admirers. He asked for followers. "If anyone wants to come after Me, he must deny himself and take up his cross daily and follow Me." Faith in Christ is not only believing the right things about Him. It is walking with Him.

Notice the word "daily." Following Jesus is not a single decision you make once and then forget. It is a choice renewed each morning: to say no to the self that wants to be in charge, and yes to the One who knows the way. That can sound heavy, but Jesus also said, "Take My yoke upon you and learn from Me... for My yoke is easy and My burden is light." The One who calls you to follow walks beside you.

Following Jesus is not about trying harder in your own strength. Jesus describes it as staying close to Him: "I am the vine and you are the branches. The one who remains in Me, and I in him, will bear much fruit. For apart from Me you can do nothing." A branch does not strain to produce fruit. It stays connected to the vine.

From the first disciples by the Sea of Galilee to His final words before His ascension, Jesus' call was the same: follow Me, learn from Me, and "make disciples of all nations." Every follower becomes part of that story.$fic$,
   $fic$Read the passage slowly, twice. What three things does Jesus ask of someone who wants to follow Him? Which of the three feels most challenging to you right now?$fic$,
   $fic$What might following Jesus daily change about the way I live this week?$fic$,
   $fic$Jesus, I want to follow You, not only admire You. Help me lay down my own way and walk in Yours each day. Keep me close to You like a branch to the vine, so that my life bears fruit for You. In Jesus' name, Amen.$fic$, null::text),
  (7, $fic$Life Together$fic$, $fic$Acts 2:42$fic$,
   $fic$After Jesus rose and ascended, His first followers didn't scatter to live their faith alone. "They devoted themselves to the apostles' teaching and to the fellowship, to the breaking of bread and to prayer." They learned together, ate together, prayed together, and shared their lives.

Faith in Christ is deeply personal, but it was never meant to be private. When you belong to Christ, you also belong to His people. Paul describes the church as a body: many parts, each one needed, none able to say to another, "I don't need you." You need others to grow, and others need what God has placed in you.

This is where your first Leap leads: not to the end of a journey, but to the beginning of a life with Christ and with His people. Whatever step comes next for you, finding a local church, joining a small group, or having one honest conversation with a believer you trust, take it. Growth happens best alongside others.

Throughout Scripture, God forms a people, not just individuals: a family through Abraham, a nation through Israel, and in Christ a new community from every tribe and tongue. Hebrews urges us, "Let us not neglect meeting together... but let us encourage one another."$fic$,
   $fic$Read the passage slowly, twice. List the four things the early believers devoted themselves to. Which of these is already part of your life, and which is missing?$fic$,
   $fic$1. What has God shown me about Jesus during these seven days?

2. Who are the people helping me become more like Christ, and what is one step I can take to connect with His people this week?$fic$,
   $fic$Father, thank You for drawing me to Yourself through Jesus. Thank You that I do not have to walk this journey alone. Lead me to people who will help me grow, and make me someone who encourages others in their faith. In Jesus' name, Amen.$fic$, null::text)
) as d(day_number, title, scripture_reference, message, explore, reflect, pray, next_topic)
where j.slug = 'faith-in-christ'
on conflict (journey_id, day_number) do nothing;
