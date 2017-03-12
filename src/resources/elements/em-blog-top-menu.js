import { bindable, containerless } from 'aurelia-framework';
import 'timeago';
let tg = timeago();

@containerless
export class EmBlogTopMenu {

    @bindable value;

    valueChanged(newValue, oldValue) {

    }

    /**
     * 当视图被附加到DOM中时被调用
     */
    attached() {
        $(this.logoRef).on('mouseenter', (event) => {
            $(this.logoRef).animateCss('flip');
        });

        $(this.searchRef)
            .search({
                minCharacters: 2,
                apiSettings: {
                    onResponse: function(resp) {
                        var response = {
                            results: []
                        };
                        $.each(resp.data.content, (index, item) => {
                            response.results.push({
                                title: item.title,
                                // description: utils.abbreviate(item.content, 65),
                                description: `<i class="wait icon"></i>${item.creator.name} 创建于 ${tg.format(item.createDate, 'zh_CN')}`,
                                url: `#/blog/${item.id}`
                            });
                        });
                        return response;
                    },
                    url: '/admin/blog/search?search={query}'
                }
            });

        this._refreshSysLinks();

        if (nsCtx.blogId == 'create') {
            _.defer(() => { $('a[href="#modaal-blog-write"]').click(); });
        }
    }

    _refreshSysLinks() {
        $.get('/admin/link/listByApp', (data) => {
            if (data.success) {
                this.sysLinks = data.data;
            } else {
                this.sysLinks = [];
            }
        });
    }
}
