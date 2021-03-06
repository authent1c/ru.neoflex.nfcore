package ru.neoflex.meta.emforientdb;

import org.eclipse.emf.ecore.resource.Resource;
import org.eclipse.emf.ecore.resource.ResourceSet;
import org.junit.*;
import ru.neoflex.meta.test.Group;
import ru.neoflex.meta.test.TestFactory;
import ru.neoflex.meta.test.User;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;

public class PerfTests extends TestBase {
    int nGroups = 10;
    int nUsers = 50;
    int nThreads = Runtime.getRuntime().availableProcessors()/2;
    int nUpdates = 100;
    List<String> groupIds = new ArrayList<>();
    List<String> userIds = new ArrayList<>();

    @BeforeClass
    public static void startUp() throws Exception {
        server = refreshDatabase(null);
    }

    @AfterClass
    public static void tearDown() {
        server.close();
    }

    @Test
    public void fullTest() throws Exception {
        long start = System.currentTimeMillis();
        for (int i = 0; i < nGroups; ++i) {
            String name = "group_" + i;
            server.inTransaction(session -> {
                Group group = TestFactory.eINSTANCE.createGroup();
                group.setQName(name);
                ResourceSet resourceSet = session.createResourceSet();
                Resource groupResource = resourceSet.createResource(server.createURI());
                groupResource.getContents().add(group);
                groupResource.save(null);
                server.getId(groupResource.getURI());
            });
        }
        server.withSession(session -> {
            session.query("select * from test_Group").forEach(resource -> {
                groupIds.add(server.getId(resource.getURI()));
            });
        });
        long created1 = System.currentTimeMillis();
        for (int i = 0; i < nUsers; ++i) {
            String name = "User_" + i;
            server.inTransaction(session -> {
                ResourceSet rs = session.createResourceSet();
                Random rand = new Random();
                String groupId = groupIds.get(rand.nextInt(groupIds.size()));
                Resource groupResource = rs.createResource(server.createURI(groupId));
                groupResource.load(null);
                Group group = (Group) groupResource.getContents().get(0);
                User user = TestFactory.eINSTANCE.createUser();
                user.setQName(name);
                user.setGroup(group);
                Resource userResource = rs.createResource(server.createURI());
                userResource.getContents().add(user);
                userResource.save(null);
            });
        }
        server.withSession(session -> {
            session.query("select * from test_User").forEach(resource -> {
                userIds.add(server.getId(resource.getURI()));
            });
        });
        long created2 = System.currentTimeMillis();
        List<Thread> threads = new ArrayList<>();
        AtomicInteger eCount = new AtomicInteger(0);
        for (int i = 0; i < nThreads; ++i) {
            final int index = i;
            Thread thread = new Thread(new Runnable() {
                @Override
                public void run() {
                    Random rand = new Random();
                    for (int j = 0; j < nUpdates; ++j) {
                        String name = "User_" + index + "_" + j;
                        String groupId = groupIds.get(rand.nextInt(groupIds.size()));
                        String userId = userIds.get(rand.nextInt(userIds.size()));
                        try {
                            server.inTransaction(session -> {
                                ResourceSet rs = session.createResourceSet();
                                Resource groupResource = rs.getResource(server.createURI(groupId), true);
                                Group group = (Group) groupResource.getContents().get(0);
                                Resource userResource = rs.getResource(server.createURI(userId), true);
                                User user = (User) userResource.getContents().get(0);
                                user.setQName(name);
                                user.setGroup(group);
                                userResource.save(null);
                            });
                        } catch (Throwable e) {
                            System.out.println(e.getMessage());
                            eCount.incrementAndGet();
                        }
                    }
                }
            });
            thread.start();
            threads.add(thread);
        }
        for (Thread thread: threads) {
            thread.join();
        }
        long finish = System.currentTimeMillis();
        System.out.println("Created " + nGroups + " groups in " + (created1 - start)/1000 + " sec");
        System.out.println("Created " + nUsers + " users  in " + (created2 - created1)/1000 + " sec");
        System.out.println("Updated " + (nUpdates*nThreads) + " users in " + nThreads + " threads in " + (finish - created2)/1000 + " sec");
        System.out.println("Update rate: " + (nUpdates*nThreads*1000)/((finish - created2)) + " users/sec");
        System.out.println("Errors found: " + eCount.get());
        Assert.assertEquals(0, eCount.get());
//        sleepForever();
    }
}
